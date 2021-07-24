import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { addPicks, selectPicksGamesIds } from '../../../../controller/picks/picksSlice';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';
import { Button } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import { selectUserPickLimit, fetchUserPickLimit } from '../../../../controller/user-pick-limit/userPickLimitSlice';
import { userStandingById, fetchUserStandings } from '../../../../controller/user-standings/userStandingsSlice';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import './game-dashboard.css';
import { status } from '../../../../configs/status';

export const GameDashboard = () => {
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status);
    const selectedGames = useSelector(selectGameIds);
    const selectedPicksGames = useSelector(selectPicksGamesIds);
    const gamesIds = selectedGames.filter(gameId => !selectedPicksGames.includes(gameId));
    const gameLoader = useSelector((state) => state.games.status);
    const pickLoader = useSelector((state) => state.picks.status);
    const initialStaged = JSON.parse(localStorage.getItem("stagedPicks"));
    const initialSubmitDates = JSON.parse(localStorage.getItem("submitDates"));
    const [submitDates, setSubmitDates] = useState(initialSubmitDates === null ? [] : initialSubmitDates);
    const [stagedPicks, setStagedPicks] = useState(initialStaged !== null ? initialStaged : {});
    const [stagedCount, setStagedCount] = useState(initialStaged === null ? 0 : Object.keys(initialStaged).length);
    const dispatch = useDispatch();
    const pickLimitState = useSelector((state) => state.userPickLimit.status);
    const pickLimit = useSelector(selectUserPickLimit);
    const userStandings = useSelector((state) => userStandingById(state, user?.user_id));
    const userStandingsState = useSelector((state) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);
    const history = useHistory();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const week = query.get("week")

    const teamSelected = (event) => {
        let updated = stagedPicks;
        let updatedDates = submitDates;
        if(event.highlight) {
            let newPick = {
                game_id: event.gameId,
                team_id: event.teamId,
                submitted_date: new Date().toISOString(),
                user_id: user.user_id
            }

            let submitDate  = {
                game_id: event.gameId,
                submitBy: event.submitBy
            }
            updatedDates = updatedDates.concat(submitDate)
            updated[event.gameId] = newPick;
        } else {
            delete updated[event.gameId];
            updatedDates = updatedDates.filter((dates) => dates.game_id !== event.gameId)
        }
        localStorage.setItem("stagedPicks", JSON.stringify(updated));
        localStorage.setItem("submitDates", JSON.stringify(updatedDates));
        setStagedCount(Object.keys(updated).length);
        setStagedPicks(updated);
        setSubmitDates(updatedDates)
    }

    const submitPicks = () => {
        let stagedPicksList = Object.values(stagedPicks);
        let totalPicks = parseInt(stagedPicksList.length) + parseInt(userStandings.pending_picks) + parseInt(userStandings.picks);
        if(stagedPicksList.length === 0) {
            alert("Going to need more than that!")
        } else if(submitDates.find((staged) => new Date(staged.submitBy) < new Date())) {
            alert("Can't Submit Passed the Deadline")
        } else if(totalPicks <= parseInt(pickLimit.max_picks)) {
            setStagedPicks({});
            setStagedCount(0);
            localStorage.setItem("stagedPicks", null);
            dispatch(addPicks({ picks: stagedPicksList }));
            history.push("/games/pick");
        } else {
            alert(`You got too many picks, ${totalPicks - pickLimit.max_picks} over ${pickLimit.max_picks}`)
        }
    }

    const noGames = gamesIds.length === 0 && (
        <div className="no-games-set secondary-color">
            No Unpicked Games
        </div>
    );
    
    const getSubmitClass = () => {
        return (stagedCount > 0 && (parseInt(week) === parseInt(league.currentWeek) || week === null)) ? "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={"game-wrapper-" + gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
                picked={stagedPicks === {} ? null : stagedPicks[gameId]}
                onTeamSelected={teamSelected}
            />
        )
    });

    useEffect(() => {
        if(userStandingsState === status.IDLE && leagueState === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType}));
        }
    }, [userState, leagueState, userStandingsState, league, dispatch]);

    useEffect(() => {
        if(pickLimitState === status.IDLE && leagueState === status.COMPLETE && userState === status.COMPLETE) {
            dispatch(fetchUserPickLimit({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek, user_id: user.user_id}))
        }
    }, [pickLimitState, leagueState, userState, league, user, dispatch]);

    useEffect(() => {
        if(submitDates.find((initial) => new Date(initial.submitBy) > new Date()) === undefined) {
            setStagedCount(0);
            setStagedPicks({});
            setSubmitDates([]);
        }
    },[]);

    if(gameLoader === status.LOADING || gamesIds === undefined || pickLoader === status.LOADING) {
        return (<GameLoader height="110" count="8"/>)
    }

    return (
        <div className="games-container page">
            { noGames }
            { games }
            <div className={getSubmitClass()}>
                <Button className="primary-background base-color submit-button" onClick={submitPicks}>
                    👍&nbsp;&nbsp;&nbsp;Submit ({stagedCount})
                </Button>
            </div>
        </div>
    );
} 