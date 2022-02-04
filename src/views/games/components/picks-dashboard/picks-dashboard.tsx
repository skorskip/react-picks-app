import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPicks, updatePicks, deletePicks, selectPicksMessage, selectGamesPicks, selectTeams, selectUserPickData } from '../../../../controller/week/weekSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON, SHOW_MESSAGE } from '../../../../configs/topics';
import { status } from '../../../../configs/status';
import { Icon } from 'semantic-ui-react';
import { selectUser } from '../../../../controller/user/userSlice';
import { RootState } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { Pick } from '../../../../model/week/pick';
import { PickDeleteRequest } from '../../../../model/postRequests/pickDeleteRequest';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { clear, publish, PubSub, subscribe } from '../../../../controller/pubSub/pubSubSlice';
import './picks-dashboard.css';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { GameCard } from '../../../../components/game-card/game-card';
import { showSubmitTime } from '../../../../utils/dateFormatter';
import { UsersPickData } from '../../../../components/users-pick-data/users-pick-data';
import { GameSubmitTime } from '../game-submit-time/game-submit-time';

export const PicksDashboard = () => {

    const games = useSelector(selectGamesPicks);
    const picks = useSelector(selectPicks);
    const teams = useSelector(selectTeams);
    const loader = useSelector((state: RootState) => state.week.status);
    const sub = useSelector(subscribe);
    const user = useSelector(selectUser);
    const pickData = useSelector(selectUserPickData);
    const picksMessage = useSelector(selectPicksMessage);

    const [updatePicksArray, setUpdatePicks] = useState([] as Pick[]);
    const [deletePicksArray, setDeletePicks] = useState([] as number[]); 
    const [inEditMode, setInEditMode] = useState(false);
    const [submitSent, setSubmitSent] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if(loader === status.ERROR) {
            if(picksMessage != null) {
                alert(picksMessage);
            } else {
                let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
                dispatch(publish(request));
            }
        }

        if(loader === status.COMPLETE && submitSent) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.EDIT_SUCCESS));
            dispatch(publish(request)); 
            setSubmitSent(false);
        }
    },[loader, picksMessage, dispatch, submitSent]);

    useEffect(() => {
        if(sub.topic === NAV_DONE_BUTTON) {
            if(deletePicksArray.length !== 0 ) {
                let request = new PickDeleteRequest(0, 0, 0, user.user_id, deletePicksArray)
                dispatch(deletePicks(request))
            }
            if(updatePicksArray.length !== 0){
                let request = new PickRequest(0,0,0, user.user_id, updatePicksArray)
                dispatch(updatePicks(request));
            }
            setSubmitSent(true);
            dispatch(clear());
        }
        
        if(sub.topic === NAV_EDIT_BUTTON) {
            setInEditMode(sub.data);
        } else {
            setInEditMode(false);
        }

    }, [dispatch, sub, updatePicksArray, deletePicksArray, user.user_id]);

    if(loader === status.LOADING) {
        return (
            <GameLoader height={110} count={8}/>
        )
    }

    const teamSelected = (event: PickSelected) => {
        let updatePick = event.pick;
        
        if(event.highlight) {
            let tempUpdate = updatePicksArray;
            if(updatePicksArray.find(pick => pick.pick_id === updatePick.pick_id)) {
                tempUpdate = updatePicksArray.filter(pick => pick.pick_id !== updatePick.pick_id);
            } else {
                tempUpdate.push(updatePick);
            }
            setUpdatePicks(tempUpdate);
        }
    }

    const onDelete = (pickToDelete: Pick) => {
        let tempDelete = deletePicksArray;
        let tempUpdate = updatePicksArray.filter(pick => pick.pick_id !== pickToDelete.pick_id)
        tempDelete.push(pickToDelete.pick_id);
        setDeletePicks(tempDelete);
        setUpdatePicks(tempUpdate);
    }

    const getGameContainerClass = (isRemoved: boolean) => {
        return (isRemoved) ? "remove" : "game-card base-background tiertary-color"
    }

    const noPicks = (!games.length) && (
        <div className="no-picks-set secondary-color">
            <div className="no-picks-set-content">No picks made</div>
            <br></br>
            <div className="secondary-color empty-icon">
                <Icon name='hand point left'/>
            </div>
        </div>
    );

    const gameCards = (games.length > 0) && games.map((game, i) => {
        let pick = picks.find(pick => pick.game_id === game.game_id);
        //@ts-ignore
        let remove = deletePicksArray.includes(pick.pick_id);

        return(
            <>
                <GameSubmitTime 
                    game={game} 
                    prevGame={games[i - 1]} 
                    user={user}
                />
                <div className={ getGameContainerClass(remove) }>
                    <GameCard
                        //@ts-ignore
                        key={"game-" + pick.pick_id}
                        game={game}
                        pick={picks.find(pick => pick.game_id === game.game_id)}
                        user={user}
                        disabled={(!inEditMode)}
                        editMode={inEditMode}
                        remove={remove}
                        //@ts-ignore
                        homeTeam={teams.find(team => team.team_id === game.home_team_id)}
                        //@ts-ignore
                        awayTeam={teams.find(team => team.team_id === game.away_team_id)}
                        onTeamSelected={(event:PickSelected) => teamSelected(event)}
                        //@ts-ignore
                        onDeleteClicked={() => onDelete(pick)}
                    />
                    <UsersPickData 
                        game={game}
                        picksData={pickData.filter(data => data.game_id === game.game_id)}
                    />
                </div>
            </>
        )
    });

    return (
        <div className="games-container page">
            { noPicks }
            { gameCards }
        </div>
    );
} 