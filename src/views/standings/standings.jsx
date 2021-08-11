import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchUserStandings, selectUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import './standings.css';
import { StandingsLoader } from './components/standings-loader';
import { PickPeekModal } from '../../components/pick-peek-modal/pick-peek-modal';
import { SHOW_MODAL, publish } from '../../utils/pubSub';
import { status } from '../../configs/status';

export const Standings = () => {
    const standings = useSelector(selectUserStandings);
    const standingsStatus = useSelector((state) => state.userStandings.status);
    const currentUser = useSelector(selectUser);
    const league = useSelector(selectLeague);
    const leagueStatus = useSelector((state) => state.league.status);
    const dispatch = useDispatch();

    const getItemClass = (user_id, addClass) => {
        return (user_id === currentUser.user_id) ? `${addClass} base-color` : `${addClass} secondary-color`;
    }

    const getCardClass = (user_id) => {
        return (user_id === currentUser.user_id) ? 'standing-card primary-color primary-background' : 'standing-card primary-color quaternary-background'
    }

    const viewModal = (standing) => {
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

    const rank = (standing) => {
        return (
            <div className="rank tiertary-color">
                <div className={getItemClass(standing.user_id, "")}>
                    {rankingSymbol(standing.ranking)}
                </div>
            </div>
        )
    }

    const user = (standing) => {
        return (
            <div className={getItemClass(standing.user_id, "user")}>
                { standing.user_inits }
            </div>
        )
    }

    const wins = (standing) => {
        return (
            <div className={getItemClass(standing.user_id, "stacked-stats")}>
                { standing.wins }
                <span className="stacked-stats-font">wins</span>
            </div>
        )
    }

    const picks = (standing) => {
        return (
            <div className={getItemClass(standing.user_id, "stacked-stats")}>
                { standing.picks }
                <span className="stacked-stats-font">picks</span>
            </div>
        )
    }

    const winPct = (standing) => {
        return (
            <div className={getItemClass(standing.user_id, "win-pct")}>
                { standing.win_pct }
            </div>
        )
    }

    const noStandings = (standings.length === 0) && (
        <div className="no-standings-set">
            No standings yet
        </div>
    )

    const standingCards = (standingsStatus === status.COMPLETE) && standings.map((standing) => {
        return (
            <div className={getCardClass(standing.user_id)} onClick={() => viewModal(standing)}>
                { rank(standing) }
                { user(standing) }
                { wins(standing) }
                { picks(standing) }
                { winPct(standing) }
            </div>
        )
    });

    const standingCardsLoading = (standingsStatus === status.LOADING) && (
        <StandingsLoader />
    ) 

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType}));
        }
    }, [dispatch, standingsStatus, leagueStatus, league]);

    return (
        <>
            <div className="standings-container">
                { noStandings }
                { standingCardsLoading }
                { standingCards }
            </div>
            <PickPeekModal />
        </>
    )
}