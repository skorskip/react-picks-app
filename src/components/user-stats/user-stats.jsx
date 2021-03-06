import React, { useEffect } from "react";
import { Progress, Icon } from 'semantic-ui-react'
import { userStandingById, fetchUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectUserPickLimit, fetchUserPickLimit } from '../../controller/user-pick-limit/userPickLimitSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectUser } from '../../controller/user/userSlice';
import './user-stats.css';
import { useDispatch, useSelector } from "react-redux";
import { status } from "../../configs/status";

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
    const pickCount = parseInt(userStandings?.picks) || 0;
    const pendingCount = parseInt(userStandings?.pending_picks) || 0;

    const picksStatLoading = (userStandingsState === status.LOADING) && (
        <>
            <div className="pick-progress-group">
                <div className="pick-progress-numbers">
                    <div>Pick Count</div>
                </div>
            </div>
            <div className="picks-stat-card-group">
                <div className="pick-stat-card tiertary-color"></div>
                <div className="pick-stat-card tiertary-color"></div>
                <div className="pick-stat-card tiertary-color"></div>
            </div>
        </>
    );

    const pickCountProgress = (userStandingsState === status.COMPLETE) && (pickLimitState === status.COMPLETE) && (
        <div className="pick-progress-group">
            <div className="pick-progress-numbers">
                <div>Pick Count</div>
                <div className="medium-font">{ pendingCount + pickCount } / { pickLimit?.max_picks }</div>
            </div>
            <Progress className="progress-bar-stat" percent={ ((pendingCount + pickCount) / parseInt(pickLimit?.max_picks )) * 100 } />
        </div>
    );

    const pickStatInfo = (userStandingsState === status.COMPLETE) && (
        <div className="picks-stat-card-group">
            <div className="pick-stat-card tiertary-color">
                <div className='secondary-color pick-stat-icon'>
                    <Icon name='hashtag' size='large' />
                    <div className="large-font">{ userStandings?.ranking || 0}</div>
                </div>
                <div className="secondary-color stat-title">rank</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className='secondary-color pick-stat-icon'>
                    <Icon name='trophy' size='large' />
                    <div className="large-font">{ userStandings?.wins }</div>
                </div>
                <div className="secondary-color stat-title">wins</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className="large-font secondary-color">{ parseFloat(userStandings?.win_pct || 0).toFixed(2) }</div>
                <div className="secondary-color stat-title">win %</div>
            </div>
        </div>
    );

    useEffect(() => {
        if(userStandingsState === status.IDLE && leagueState === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [userState, leagueState, userStandingsState, league, dispatch]);

    useEffect(() => {
        if(pickLimitState === status.IDLE && leagueState === status.COMPLETE && userState === status.COMPLETE) {
            dispatch(fetchUserPickLimit({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek, user_id: user.user_id}))
        }
    }, [pickLimitState, leagueState, userState, league, user, dispatch]);

    return (
        <div className="user-stat-card base-background tiertary-color">
            <div className="user-stat-card-section secondary-color">
                <div className="user-stats-info-content">
                    <div className="pick-progress-container">
                        { picksStatLoading }
                        { pickCountProgress }
                        { pickStatInfo }
                    </div>
                </div>
            </div>
        </div>
    );
}