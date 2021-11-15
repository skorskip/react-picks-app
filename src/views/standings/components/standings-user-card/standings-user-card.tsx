import React from 'react';
import { Icon } from 'semantic-ui-react';
import { SHOW_MODAL } from '../../../../configs/topics';
import '../../standings.css';
import { useDispatch } from 'react-redux';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { ProfileImage } from '../../../../components/profile-image/profile-image';
import { User } from '../../../../model/user/user';

type Props = {
    standing: User,
    isCurrentUser: boolean
}

export const StandingsUserCard = ({ standing, isCurrentUser }: Props) => {

    const dispatch = useDispatch();
    const bonusCount = Array(standing.current_season_data.bonus_nbr).fill("");

    const getItemClass = (addClass: string) => {
        return (isCurrentUser) ? `${addClass} base-color` : `${addClass} secondary-color`;
    }

    const getCardClass = () => {
        return (isCurrentUser) ? 'standing-card primary-color primary-background' : 'standing-card primary-color quaternary-background'
    }

    const getRankStatusClass = () => {
        if(standing.current_season_data.ranking < standing.current_season_data.prev_ranking) {
            return "success-color rank-status-icon";
        } else if (standing.current_season_data.ranking > standing.current_season_data.prev_ranking) {
            return "failure-color rank-status-icon";
        } else {
            return;
        }
    }

    const getRankStatusIcon = () => {

        if(standing.current_season_data.ranking < standing.current_season_data.prev_ranking) {
            return "caret up";
        } else if (standing.current_season_data.ranking > standing.current_season_data.prev_ranking) {
            return "caret down";
        } else {
            return "minus";
        }
    }

    const viewModal = () => {
        dispatch(publish(new PubSub(SHOW_MODAL, standing)));
    }

    const rankingSymbol = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <div className="leader-icon">
                        👑
                    </div>
                )
            default:
                return (
                    <div className="rank-font">
                        { rank }
                    </div>
                )
        }

    }

    const rank = (
        <div className="rank tiertary-color">
            <div className={getItemClass("rank-content")}>
                {rankingSymbol(standing.current_season_data.ranking)}
                <div className={getRankStatusClass()}>
                    <Icon name={getRankStatusIcon()}/>
                </div>
            </div>
        </div>
    )

    const user = (
        <div className={getItemClass("user")}>
            <ProfileImage size="s" image={standing.slack_user_image} content={standing.user_inits} showImage={true}/>
            <div className="user-content">
                {standing.first_name}&nbsp;{standing.last_name[0]}.
            </div>
        </div>
    )

    const bonus = (
        <div className="bonus">
            <div className="standing-card-bonus-icon success-color">
                { bonusCount.map((count, i) => {return (<span key={i + standing.user_id + "-bonus"}>$</span>)}) }
            </div>
        </div>
    )

    const wins = (
        <div className={getItemClass("stacked-stats")}>
            { standing.current_season_data.wins }
            <span className="stacked-stats-font">wins</span>
        </div>
    )

    const picks = (
        <div className={getItemClass("stacked-stats")}>
            { standing.current_season_data.picks }
            <span className="stacked-stats-font">picks</span>
        </div>
    )

    const winPct = (
            <div className={getItemClass("win-pct")}>
                { standing.current_season_data.win_pct.toFixed(3) }
            </div>
    )

    return (
        <div className={getCardClass()} onClick={viewModal}>
            { rank }
            { user }
            { wins }
            { picks }
            { winPct }
            { bonus }
        </div>
    )
}