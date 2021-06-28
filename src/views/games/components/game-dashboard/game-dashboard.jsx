import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { addPicks, selectPicksGamesIds } from '../../../../controller/picks/picksSlice';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';
import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { selectUserPickLimit, fetchUserPickLimit } from '../../../../controller/user-pick-limit/userPickLimitSlice';
import { userStandingById, fetchUserStandings } from '../../../../controller/user-standings/userStandingsSlice';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import './game-dashboard.css';

export const GameDashboard = () => {
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status);
    const selectedGames = useSelector(selectGameIds);
    const selectedPicksGames = useSelector(selectPicksGamesIds);
    const gamesIds = selectedGames.filter(gameId => !selectedPicksGames.includes(gameId));
    const gameLoader = useSelector((state) => state.games.status);
    const pickLoader = useSelector((state) => state.picks.status);
    const initialStaged = JSON.parse(localStorage.getItem("stagedPicks"));
    const [stagedPicks, setStagedPicks] = useState(
        (initialStaged !== null && Object.values(initialStaged).find((stage) => new Date(stage.submitBy) < new Date()) !== undefined ) ? initialStaged : {}
    );
    const [stagedCount, setStagedCount] = useState(initialStaged === null ? 0 : Object.keys(initialStaged).length);
    const dispatch = useDispatch();
    const pickLimitState = useSelector((state) => state.userPickLimit.status);
    const pickLimit = useSelector(selectUserPickLimit);
    const userStandings = useSelector((state) => userStandingById(state, user?.user_id));
    const userStandingsState = useSelector((state) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);
    const history = useHistory();

    const teamSelected = (event) => {
        let updated = stagedPicks;
        if(event.highlight) {
            let newPick = {
                game_id: event.gameId,
                team_id: event.teamId,
                submitted_date: new Date().toISOString(),
                user_id: user.user_id,
                submitBy: event.submitBy
            }

            updated[event.gameId] = newPick;
        } else {
            delete updated[event.gameId]
        }
        localStorage.setItem("stagedPicks", JSON.stringify(updated));
        setStagedCount(Object.keys(updated).length);
        setStagedPicks(updated);
    }

    const submitPicks = () => {
        let stagedPicksList = Object.values(stagedPicks);
        if(stagedPicksList.length > 0) {

        } else if(stagedPicksList.find((staged) => new Date(staged.submitBy) < new Date())) {

        } else if(parseInt(stagedPicksList.length) + 
            parseInt(userStandings.pending_picks) + 
            parseInt(userStandings.picks) <= parseInt(pickLimit.max_limit)) {

                setStagedPicks({});
                setStagedCount(0);
                localStorage.setItem("stagedPicks", null);
                dispatch(addPicks({ picks: stagedPicksList }));
                history.push("/games/pick");
        }
    }

    const noGames = gamesIds.length === 0 && (
        <div className="no-games-set secondary-color">
            No Unpicked Games
        </div>
    );
    
    const getSubmitClass = () => {
        return (stagedCount > 0) ? "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={"game-wrapper-" + gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
                picked={initialStaged === null ? null : initialStaged[gameId]}
                onTeamSelected={teamSelected}
            />
        )
    });

    useEffect(() => {
        if(userStandingsState === 'idle' && leagueState === 'complete') {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType}));
        }
    }, [userState, leagueState, league, dispatch]);

    useEffect(() => {
        if(pickLimitState === 'idle' && leagueState === 'complete' && userState === 'complete') {
            dispatch(fetchUserPickLimit({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek, user_id: user.user_id}))
        }
    }, [pickLimitState, leagueState, userState, league, user]);

    if(gameLoader === 'loading' || gamesIds === undefined || pickLoader === 'loading') {
        return (<GameLoader height="110" count="8"/>)
    }

    return (
        <div className="games-container page">
            { noGames }
            { games }
            <div className={getSubmitClass()}>
                <Button className="primary-background base-color submit-button" onClick={submitPicks}>
                    Submit ({stagedCount})
                </Button>
            </div>
        </div>
    );
} 