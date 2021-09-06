import React from 'react';
import { Icon, Label } from 'semantic-ui-react';
import { SHOW_MODAL, publish } from '../../../../utils/pubSub';
import '../../standings.css';

export const StandingsUserCard = ({ standing, isCurrentUser }) => {

    const getItemClass = (addClass) => {
        return (isCurrentUser) ? `${addClass} base-color` : `${addClass} secondary-color`;
    }

    const getCardClass = () => {
        return (isCurrentUser) ? 'standing-card primary-color primary-background' : 'standing-card primary-color quaternary-background'
    }

    const getRankStatusClass = () => {
        if(standing.ranking < standing.prev_ranking) {
            return "success-color rank-status-icon";
        } else if (standing.ranking > standing.prev_ranking) {
            return "failure-color rank-status-icon";
        } else {
            return;
        }
    }

    const getRankStatusIcon = () => {

        if(standing.ranking < standing.prev_ranking) {
            return "caret up";
        } else if (standing.ranking > standing.prev_ranking) {
            return "caret down";
        } else {
            return "minus";
        }
    }

    const viewModal = () => {
        publish(SHOW_MODAL, standing);
    }

    const rankingSymbol = (rank) => {
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
                {rankingSymbol(standing.ranking)}
                <div className={getRankStatusClass()}>
                    <Icon name={getRankStatusIcon()}/>
                </div>
            </div>
        </div>
    )

    const user = (
        <div className={getItemClass("user")}>
            { standing.user_inits }
        </div>
    )

    const bonus = (
        <div className="bonus">
            <div className="standing-card-bonus-icon success-color">
                { Array(parseInt(standing.bonus_nbr)).fill(<span>$</span>) }
            </div>
        </div>
    )

    const wins = (
        <div className={getItemClass("stacked-stats")}>
            { standing.wins }
            <span className="stacked-stats-font">wins</span>
        </div>
    )

    const picks = (
        <div className={getItemClass("stacked-stats")}>
            { standing.picks }
            <span className="stacked-stats-font">picks</span>
        </div>
    )

    const winPct = (
            <div className={getItemClass("win-pct")}>
                { standing.win_pct.toFixed(3) }
            </div>
    )

    return (
        <div className={getCardClass(standing.user_id)} onClick={viewModal}>
            { rank }
            { user }
            { wins }
            { picks }
            { winPct }
            { bonus }
        </div>
    )
}