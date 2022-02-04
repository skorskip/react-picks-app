import React,{ useEffect, useState } from 'react';
import { TeamCard } from '../team-card/team-card';
import { PickStatus } from '../pick-staus/pick-status';
import { Icon, Button } from 'semantic-ui-react';
import { GameWinStatusEnum, GameStatusEnum, Game } from '../../model/week/game';
import { Pick } from '../../model/week/pick';
import { Team, TeamSelect } from '../../model/week/team';
import { PickSelected } from '../../model/pickSelected/pickSelected';
import { User } from '../../model/user/user';
import './game-card.css';
import { gameTimeStatusQuarters } from '../../utils/dateFormatter';

type Props = {
    game: Game,
    pick: Pick | undefined,
    user: User,
    disabled: boolean,
    editMode: boolean,
    remove: boolean,
    showSubmitTime: boolean,
    homeTeam: Team,
    awayTeam: Team,
    onTeamSelected: (selected: PickSelected) => void,
    onDeleteClicked: () => void
}

export const GameCard = ({
    game,
    pick,
    user,
    disabled,
    editMode,
    remove,
    homeTeam,
    awayTeam,
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

    const fillTeam = (teamId: number): boolean => {
        return teamId === game.winning_team_id;
    }

    const teamSelected = (event: TeamSelect) => {
        let selectedPick = new Pick(0, user.user_id, game.game_id, event.team.team_id, game.pick_submit_by_date);
        let pickOpt = new PickSelected(event.highlight, selectedPick);

        if(editMode) {
            if(event.highlight) {
                setHighlightAway(!highlightAway);
                setHighlightHome(!highlightHome);
                pickOpt.highlight = true;
                pickOpt.pick.pick_id = pick ? pick.pick_id : 0;
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

    const deleteButton = (editMode && !gameLocked && !remove) && (
        <Button className="delete-button bottom-margin failure-color base-background" onClick={() => onDeleteClicked()}>
        <Icon name= "trash alternate outline" />
            Delete
        </Button>
    );

    const timeStatus = (gameLocked && game.game_status !== GameStatusEnum.completed) && (
        <div className="game-card-date">
            <div className="date-text accent">
                <Icon className="primary-color" name="stopwatch"/>
                { gameTimeStatusQuarters(game) }
            </div>
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
            {timeStatus}
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
            { deleteButton }
        </>
    )

}