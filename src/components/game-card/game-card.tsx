import React,{ useEffect, useState } from 'react';
import { gameTimeStatusQuarters, formatDate } from '../../utils/dateFormatter';
import { TeamCard } from './components/team-card/team-card';
import { PickStatus } from './components/pick-staus/pick-status';
import { Icon, Button } from 'semantic-ui-react';
import './game-card.css';
import { GameWinStatusEnum, GameStatusEnum, Game } from '../../model/game/game';
import { UsersPickData } from './components/users-pick-data/users-pick-data';
import { Pick } from '../../model/pick/pick';
import { Team, TeamSelect } from '../../model/team/team';
import { PickSelected } from '../../model/pickSelected/pickSelected';

type Props = {
    game: Game,
    homeTeam: Team,
    awayTeam: Team,
    pick: Pick,
    userId: number,
    showSubmitTime: boolean,
    disabled: boolean,
    editMode: boolean,
    showDeleteButton: boolean,
    remove: boolean,
    onTeamSelected: (selected: PickSelected) => void,
    onDeleteClicked: () => void
}

export const GameCard = ({ 
    game, 
    homeTeam, 
    awayTeam, 
    pick,
    userId,
    showSubmitTime, 
    disabled,
    editMode,
    showDeleteButton,
    remove,
    onTeamSelected,
    onDeleteClicked }: Props) => {

    const [highlightHome, setHighlightHome] = useState(false);
    const [highlightAway, setHighlightAway] = useState(false);
    const gameLocked = new Date(game?.pick_submit_by_date) <= new Date();

    const pickResult = () => {
        if(game.game_status === GameStatusEnum.completed && pick != null){
            if(pick.team_id === game.winning_team_id) {
              return GameWinStatusEnum.win;
            } else if(game.winning_team_id === null) {
              return GameWinStatusEnum.push;
            } else {
              return GameWinStatusEnum.loss;
            }
          }
          else {
            return null;
          }
    }

    const fillTeam = (teamId: number) => {
        return teamId === game.winning_team_id;
    }

    const teamSelected = (event: TeamSelect) => {
        let selectedPick = new Pick(0, userId, game.game_id, event.team.team_id, game.pick_submit_by_date);
        let pickOpt = new PickSelected(event.highlight, selectedPick);

        if(editMode) {
            if(event.highlight) {
                setHighlightAway(!highlightAway);
                setHighlightHome(!highlightHome);
                pickOpt.highlight = true;
                pickOpt.pick.pick_id = pick.pick_id;
                onTeamSelected(pickOpt);
            }
        } else if(event.team.team_id === awayTeam.team_id) {
            if(event.highlight) setHighlightHome(false);
            setHighlightAway(event.highlight);
            onTeamSelected(pickOpt);
        } else {
            if(event.highlight) setHighlightAway(false);
            setHighlightHome(event.highlight);
            onTeamSelected(pickOpt);
        }
    }

    const submitBy = showSubmitTime && (
        <div className='full-row'>
            <div className="game-card-date">
                <div className="date-text primary-color">
                    <Icon name="calendar alternate outline"/>
                    Submit by: { formatDate(new Date(game.pick_submit_by_date)) }
                </div>
            </div>
        </div>
    );

    const timeStatus = (gameLocked && game.game_status !== GameStatusEnum.completed) && (
        <div className="game-card-date">
            <div className="date-text accent">
                <Icon name="stopwatch"/>
                { gameTimeStatusQuarters(game) }
            </div>
        </div>
    );

    const pickData = gameLocked && (
        <UsersPickData game={game}/>
    )

    const getGameContainerClass = (isRemoved: boolean) => {
        return (isRemoved) ? "remove" : "game-card base-background tiertary-color"
    }

    const deleteButton = (showDeleteButton) && (
        <Button className="delete-button bottom-margin failure-color base-background" onClick={() => onDeleteClicked()}>
        <Icon name= "trash alternate outline" />
            Delete
        </Button>
    )

    const gameItem =  game !== undefined && (
        <div className={ getGameContainerClass(remove) }>
            { timeStatus }
            <div className="team-group secondary-color">
                <TeamCard 
                    team={awayTeam}
                    score={game.away_team_score}
                    highlight={highlightAway}
                    locked={gameLocked}
                    fill={fillTeam(game.away_team_id)}
                    disabled={disabled}
                    onTeamSelected={teamSelected}
                    size={null}
                    spread={null}
                />
                <PickStatus
                    submitTime={game?.pick_submit_by_date}
                    pickSuccess={pickResult()}
                    gameStatus={game?.game_status}
                />
                <TeamCard 
                    team={homeTeam}
                    score={game.home_team_score}
                    highlight={highlightHome}
                    locked={gameLocked}
                    fill={fillTeam(game.home_team_id)}
                    spread={game.home_spread}
                    disabled={disabled}
                    onTeamSelected={teamSelected}
                    size={null}
                />
            </div>
            { pickData }
            { deleteButton }
        </div>
    );

    useEffect(() => {
        if(pick != null && game != null) {
            setHighlightHome(game.home_team_id === pick.team_id)
            setHighlightAway(game.away_team_id === pick.team_id)
        }
    }, [pick, game]);

    return (
        <>
            { submitBy }
            { gameItem }
        </>
    )

}