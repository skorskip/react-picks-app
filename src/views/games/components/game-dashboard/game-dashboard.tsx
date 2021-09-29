import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { selectGamesByIdNoPicks, selectPicksMessage, addPicks } from '../../../../controller/week/weekSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { Button, Icon } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { status } from '../../../../configs/status';
import { setStagedPicksLocal, resetStagedPicksLocal, getStagedPicksLocal } from '../../../../utils/localData';
import { RootState } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { Pick } from '../../../../model/week/pick';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { SHOW_MESSAGE } from '../../../../configs/topics';
import { GameCard } from '../../../../components/game-card/game-card';
import { toInt } from '../../../../utils/tools';
import './game-dashboard.css';

export const GameDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const gamesIds = useSelector(selectGamesByIdNoPicks);
    const gameLoader = useSelector((state: RootState) => state.week.status);
    const picksMessage = useSelector(selectPicksMessage);
    const league = useSelector(selectLeague);
    
    const history = useHistory();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const week = toInt(query.get("week"));

    const [stagedPicks, setStagedPicks] = useState(getStagedPicksLocal() != null ? getStagedPicksLocal() : {});
    const [stagedCount, setStagedCount] = useState(getStagedPicksLocal() == null ? 0 : Object.keys(getStagedPicksLocal()).length);
    const [submitSent, setSubmitSent] = useState(false);

    const teamSelected = (event: PickSelected) => {
        let updated = setStagedPicksLocal(stagedPicks, event);
        setStagedCount(Object.keys(updated).length);
        setStagedPicks(updated);
    }

    const submitPicks = () => {
        let stagedPicksList = Object.values(stagedPicks) as Pick[];
        let request = new PickRequest(0,0,0,user.user_id,stagedPicksList)
        dispatch(addPicks(request));
        setSubmitSent(true);
    }

    const noGames = gamesIds.length === 0 && (
        <div className="no-games-set secondary-color">
            No Unpicked Games
        </div>
    );
    
    const getSubmitClass = () => {
        return (stagedCount > 0 && 
            (week === league.currentWeek || week == null)) ? 
            "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const games = gamesIds.map((gameId, i) => {
        return(
            <GameCard
                key={"game-" + gameId}
                gameId={gameId}
                prevGameId={i !== 0 ? gamesIds[i - 1] : null}
                pick={stagedPicks === {} ? null : stagedPicks[gameId]}
                userId={user?.user_id}
                disabled={false}
                onTeamSelected={(event: PickSelected) => teamSelected(event)}
                editMode={false}
                showDeleteButton={false}
                remove={false}
                onDeleteClicked={() => null}
            />
        )
    });

    useEffect(() => {
        if(Object.values(stagedPicks).find((initial:any) => 
            new Date(initial.pick_submit_by_date) > new Date()) == null) {

            setStagedCount(0);
            setStagedPicks({});
        }
    },[]);

    useEffect(() => {
        if(gameLoader === status.COMPLETE && submitSent) {
            setStagedPicks({});
            setStagedCount(0);
            resetStagedPicksLocal();
            setSubmitSent(false);

            let request = new PubSub(SHOW_MESSAGE, 
                new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.ADD_SUCCESS));
            dispatch(publish(request));

            history.push("/games/pick");
        }
        if(gameLoader === status.ERROR && submitSent) {
            setSubmitSent(false);
            if(picksMessage != null) {
                alert(picksMessage);
            } else {
                let request = new PubSub(SHOW_MESSAGE, 
                    new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
                dispatch(publish(request));
            }
        }
    },[gameLoader, submitSent, stagedPicks, history, picksMessage, dispatch]);

    if(gameLoader === status.LOADING || gamesIds === undefined) {
        return (<GameLoader height={110} count={8}/>)
    }
    
    return (
        <>
            <div className="games-container page">
                { noGames }
                { games }
            </div>
            <div className={getSubmitClass()}>
                <Button className="primary-background base-color submit-button" onClick={submitPicks}>
                    <Icon name='send'/> Submit ({stagedCount})
                </Button>
            </div>
        </>
    );
} 