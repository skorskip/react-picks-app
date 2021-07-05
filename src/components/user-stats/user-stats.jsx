import React, { useEffect } from "react";
import { Progress } from 'semantic-ui-react'
import { userStandingById, fetchUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectUserPickLimit, fetchUserPickLimit } from '../../controller/user-pick-limit/userPickLimitSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectUser } from '../../controller/user/userSlice';
import './user-stats.css';
import { useDispatch, useSelector } from "react-redux";

export const UserStats = () => {
    
    const dispatch = useDispatch();
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status);
    const pickLimit = useSelector(selectUserPickLimit);
    const pickLimitState = useSelector((state) => state.userPickLimit.status);
    const userStandings = useSelector((state) => userStandingById(state, user?.user_id));
    const userStandingsState = useSelector((state) => state.userStandings.status);

    const pickCountProgress = (userStandingsState === 'complete') && (pickLimitState === 'complete') && (
        <div className="pick-progress-group">
            <div className="pick-progress-numbers">
                <div>Pick Count</div>
                <div className="medium-font">{ userStandings?.picks + userStandings?.pending_picks } / { pickLimit?.max_picks }</div>
            </div>
            <Progress className="progress-bar-stat" percent={ (parseInt(userStandings?.picks + userStandings?.pending_picks) / parseInt(pickLimit?.max_picks )) * 100 } />
        </div>
    );

    const pickStatInfo = (userStandingsState === 'complete') && (
        <div className="picks-stat-card-group">
            <div className="pick-stat-card tiertary-color">
                <div className="large-font secondary-color">#️⃣{ userStandings?.ranking }</div>
                <div className="secondary-color">rank</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className="large-font secondary-color">🎉{ userStandings?.wins }</div>
                <div className="secondary-color">wins</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className="large-font secondary-color">{ parseFloat(userStandings?.win_pct).toFixed(2) }</div>
                <div className="secondary-color">win %</div>
            </div>
        </div>
    );

    useEffect(() => {
        if(userStandingsState === 'idle' && leagueState === 'complete') {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType}));
        }
    }, [userState, leagueState, userStandingsState, league, dispatch]);

    useEffect(() => {
        if(pickLimitState === 'idle' && leagueState === 'complete' && userState === 'complete') {
            dispatch(fetchUserPickLimit({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek, user_id: user.user_id}))
        }
    }, [pickLimitState, leagueState, userState, league, user, dispatch]);

    return (
        <div className="user-stat-card base-background tiertary-color">
            <div className="user-stat-card-section secondary-color">
                <div className="user-stats-info-content">
                    <div className="pick-progress-container">
                        { pickCountProgress }
                        { pickStatInfo }
                    </div>
                </div>
            </div>
        </div>
    );
}