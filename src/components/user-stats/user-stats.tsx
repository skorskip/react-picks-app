import React, { useEffect } from "react";
import { Progress, Icon } from 'semantic-ui-react'
import { userStandingById, fetchUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectUserDetails, fetchUserDetails } from '../../controller/user-details/userDetailsSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectUser } from '../../controller/user/userSlice';
import './user-stats.css';
import { useDispatch, useSelector } from "react-redux";
import { status } from "../../configs/status";
import { RootState } from "../../store";

export const UserStats = () => {
    
    const dispatch = useDispatch();
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state: RootState) => state.league.status);
    const user = useSelector(selectUser);
    const userState = useSelector((state: RootState) => state.user.status);
    const userDetails = useSelector(selectUserDetails);
    const userDetailsState = useSelector((state: RootState) => state.userDetails.status);
    
    const pickCount = userDetails?.picks || 0;
    const pendingCount = userDetails?.pending_picks || 0;

    const picksStatLoading = (userDetailsState === status.LOADING) && (
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

    const pickCountProgress = (userDetailsState === status.COMPLETE) && (
        <div className="pick-progress-group">
            <div className="pick-progress-numbers">
                <div>Pick Count</div>
                <div className="medium-font">{ pendingCount + pickCount } / { userDetails?.max_picks }</div>
            </div>
            <Progress className="progress-bar-stat" percent={ ((pendingCount + pickCount) / parseInt(userDetails?.max_picks )) * 100 } />
        </div>
    );

    const pickStatInfo = (userDetailsState === status.COMPLETE) && (
        <div className="picks-stat-card-group">
            <div className="pick-stat-card tiertary-color">
                <div className='secondary-color pick-stat-icon'>
                    <Icon name='hashtag' size='large' />
                    <div className="large-font">{ userDetails?.ranking || 0}</div>
                </div>
                <div className="secondary-color stat-title">rank</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className='secondary-color pick-stat-icon'>
                    <Icon name='trophy' size='large' />
                    <div className="large-font">{ userDetails?.wins }</div>
                </div>
                <div className="secondary-color stat-title">wins</div>
            </div>
            <div className="pick-stat-card tiertary-color">
                <div className="large-font secondary-color">{ (userDetails?.win_pct || 0).toFixed(2) }</div>
                <div className="secondary-color stat-title">win %</div>
            </div>
        </div>
    );

    useEffect(() => {
        if(userDetailsState === status.IDLE && leagueState === status.COMPLETE && userState === status.COMPLETE) {
            dispatch(fetchUserDetails(user.user_id));
        }
    }, [userDetailsState, leagueState, userState, league, user, dispatch]);

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