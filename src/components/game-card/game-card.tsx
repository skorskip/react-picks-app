import React,{ useEffect, useState } from 'react';
import { gameTimeStatusQuarters, formatDate } from '../../utils/dateFormatter';
import { TeamCard } from './components/team-card/team-card';
import { PickStatus } from './components/pick-staus/pick-status';
import { Icon, Button } from 'semantic-ui-react';
import './game-card.css';
import { GameWinStatusEnum, GameStatusEnum } from '../../model/game/game';
import { UsersPickData } from './components/users-pick-data/users-pick-data';
import { Pick } from '../../model/pick/pick';
import { TeamSelect } from '../../model/team/team';
import { PickSelected } from '../../model/pickSelected/pickSelected';
import { useDispatch, useSelector } from 'react-redux';
import { selectGamesById, selectTeamById, showSubmitByGameId } from '../../controller/games/gamesSlice';
import { RootState } from '../../store';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { selectUser } from '../../controller/user/userSlice';
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice';
import { SHOW_MESSAGE } from '../../configs/topics';
import { SnackMessage } from '../message/messagePopup';
import { status } from '../../configs/status';

type Props = {
    gameId: number,
    prevGameId: number | null,
    pick: Pick,
    userId: number,
    disabled: boolean,
    editMode: boolean,
    showDeleteButton: boolean,
    remove: boolean,
    onTeamSelected: (selected: PickSelected) => void,
    onDeleteClicked: () => void
}

export const GameCard = ({
    gameId,
    prevGameId,
    pick,
    userId,
    disabled,
    editMode,
    showDeleteButton,
    remove,
    onTeamSelected,
    onDeleteClicked }: Props) => {

    const game = useSelector((state: RootState) => selectGamesById(state, gameId));
    const homeTeam = useSelector((state: RootState) => selectTeamById(state, game?.home_team_id));
    const awayTeam = useSelector((state: RootState) => selectTeamById(state, game?.away_team_id));
    const [highlightHome, setHighlightHome] = useState(false);
    const [highlightAway, setHighlightAway] = useState(false);
    const gameLocked = new Date(game?.pick_submit_by_date) <= new Date();
    const showSubmitTime = useSelector((state: RootState) => showSubmitByGameId(state, gameId, prevGameId));
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

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

    const callSetReminder = async () => {
        try {
            let url = endpoints.MESSAGES.SET_REMINDER;
            let response = await client.post(url, {
                pick_submit_by_date: game.pick_submit_by_date,
                slack_user_id: user.slack_user_id
            });

            if(!response.error) {
                let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.SUCCESS, status.MESSAGE.REMINDERS.SET_SUCCESS));
                dispatch(publish(request)); 
            }

        } catch(error) {
            console.error(error);
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }

    const setReminder = async () => {
        let dialogConfirm = window.confirm("Set slack reminder?");

        if(dialogConfirm) {
            callSetReminder();
        }
    }

    const submitBy = showSubmitTime && (
        <div className='full-row'>
            <div className="game-card-date">
                <Button className="date-text tiertary-light-background secondary-color" onClick={setReminder}>
                    <Icon name="calendar alternate outline"/>
                    Submit by: { formatDate(new Date(game?.pick_submit_by_date)) }
                </Button>
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

    const deleteButton = (showDeleteButton && !gameLocked) && (
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