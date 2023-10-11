import React from "react";
import { Progress, Icon } from 'semantic-ui-react'
import { selectUser } from '../../controller/user/userSlice';
import './user-stats.css';
import { useSelector } from "react-redux";
import { status } from "../../configs/status";
import { RootState } from "../../store";
import { selectGamesPicks } from "../../controller/week/weekSlice";
import { GameStatusEnum } from "../../model/week/game";

export const UserStats = () => {

    const user = useSelector(selectUser);
    const userDetails = user.current_season_data;
    const userState = useSelector((state: RootState) => state.user.status);
    const pendingCount = useSelector(selectGamesPicks).filter(p => p.game_status !== GameStatusEnum.completed).length || 0;
    const pickCount = userDetails?.picks || 0;

    const picksStatLoading = (userState === status.LOADING) && (
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

    const pickCountProgress = (userState === status.COMPLETE) && (
        <div className="pick-progress-group tiertary-color">
            <div className="pick-progress-numbers secondary-color">
                <div>Pick Count</div>
                <div className="medium-font">{ pendingCount + pickCount } / { userDetails?.max_picks }</div>
            </div>
            <Progress className="progress-bar-stat" size='tiny' percent={ ((pendingCount + pickCount) / userDetails?.max_picks) * 100 } />
        </div>
    );

    const pickStatInfo = (userState === status.COMPLETE) && (
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