import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { addPicks, selectPicksGamesIds, selectPicksMessage } from '../../../../controller/picks/picksSlice';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';
import { Button, Icon } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { status } from '../../../../configs/status';
import { setStagedPicksLocal, resetStagedPicksLocal, getStagedPicksLocal } from '../../../../utils/localData';
import './game-dashboard.css';
import { RootState } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { Pick } from '../../../../model/pick/pick';

export const GameDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const selectedGames = useSelector(selectGameIds);
    const selectedPicksGames = useSelector(selectPicksGamesIds);
    const gamesIds = selectedGames.filter(gameId => !selectedPicksGames.includes(gameId));
    const gameLoader = useSelector((state: RootState) => state.games.status);
    const pickLoader = useSelector((state: RootState) => state.picks.status);
    const picksMessage = useSelector(selectPicksMessage);
    const league = useSelector(selectLeague);
    
    const history = useHistory();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const week = parseInt(query.get("week") || "");

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
            (week === parseInt(league.currentWeek) 
            || week === null)) ? 
            "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={"game-wrapper-" + gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
                picked={stagedPicks === {} ? null : stagedPicks[gameId]}
                userId={user?.user_id}
                onTeamSelected={teamSelected}
            />
        )
    });

    useEffect(() => {
        if(Object.values(stagedPicks).find((initial:any) => new Date(initial.pick_submit_by_date) > new Date()) == null) {
            setStagedCount(0);
            setStagedPicks({});
        }
    },[]);

    useEffect(() => {
        if(pickLoader === status.COMPLETE && submitSent) {
            setStagedPicks({});
            setStagedCount(0);
            resetStagedPicksLocal();
            setSubmitSent(false);
            history.push("/games/pick");
        }
        if(pickLoader === status.ERROR && submitSent) {
            setSubmitSent(false);
            if(picksMessage != null) {
                alert(picksMessage);
            }
        }
    },[pickLoader, submitSent, stagedPicks, history, picksMessage]);

    if(gameLoader === status.LOADING || 
        gamesIds === undefined || 
        pickLoader === status.LOADING) {

        return (<GameLoader height={110} count={8}/>)
    }

    return (
        <div className="games-container page">
            { noGames }
            { games }
            <div className={getSubmitClass()}>
                <Button className="primary-background base-color submit-button" onClick={submitPicks}>
                    <Icon name='send'/> Submit ({stagedCount})
                </Button>
            </div>
        </div>
    );
} 