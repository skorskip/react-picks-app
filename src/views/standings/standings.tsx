import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchUserStandings, selectUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import './standings.scss';
import { StandingsLoader } from './components/standings-loader/standings-loader';
import { PickPeekModal } from '../../components/pick-peek-modal/pick-peek-modal';
import { status } from '../../configs/status';
import { StandingsUserCard } from '../../components/standings-user-card/standings-user-card';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../store';

export const Standings = () => {
    const standings = useSelector(selectUserStandings);
    const standingsStatus = useSelector((state: RootState) => state.userStandings.status);
    const currentUser = useSelector(selectUser);
    const league = useSelector(selectLeague);
    const leagueStatus = useSelector((state: RootState) => state.league.status);
    const dispatch = useDispatch();

    const bonusCard = (
        <div className="bonus-card base-background success-color">
            <div className="bonus-card-icon">
                <Icon name="dollar"/>
            </div>
            <div className="bonus-card-content secondary-color">
                Weekly Bonus at ${league.bonus.currentPotAmt.toFixed(2)}
            </div>
        </div>
    )

    const noStandings = (standings.length === 0 && standingsStatus !== status.LOADING) && (
        <div className="no-standings-set secondary-color">
            No standings yet
        </div>
    )

    const standingCards = (standingsStatus === status.COMPLETE) && standings.map((standing) => {
        return (
            <StandingsUserCard
                key={ standing.user_id + "-standings-card"}
                standing={standing}
                isCurrentUser={standing.user_id === currentUser.user_id}
            />
        )
    });

    const standingCardsLoading = (standingsStatus === status.LOADING) && (
        <StandingsLoader />
    ) 

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [dispatch, standingsStatus, leagueStatus, league]);

    return (
        <>
            <div className="standings-container">
                { bonusCard }
                { noStandings }
                { standingCardsLoading }
                { standingCards }
            </div>
            <PickPeekModal />
        </>
    )
}