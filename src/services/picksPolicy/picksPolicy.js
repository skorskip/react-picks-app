import React, { useState, useEffect } from 'react';
import { selectUserPickLimit, fetchUserPickLimit } from '../../controller/user-pick-limit/userPickLimitSlice';
import { userStandingById, fetchUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { status } from '../../configs/status';

export const PicksPolicy = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status);
    const pickLimitState = useSelector((state) => state.userPickLimit.status);
    const pickLimit = useSelector(selectUserPickLimit);
    const userStandings = useSelector((state) => userStandingById(state, user?.user_id));
    const userStandingsState = useSelector((state) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);

    const submit = (stagedPicks) => {
        let stagedPicksList = Object.values(stagedPicks);
        let totalPicks = parseInt(stagedPicksList.length) + 
            parseInt(userStandings?.pending_picks || 0) + 
            parseInt(userStandings?.picks || 0);
        
        if(stagedPicksList.length === 0) {
            alert("Going to need more than that!")
        } else if(stagedPicksList.find((staged) => new Date(staged.pick_submit_by_date) < new Date())) {
            alert("Can't Submit Passed the Deadline")
        } else if(totalPicks >= parseInt(pickLimit.max_picks)) {
            alert(`You got too many picks, ${totalPicks - pickLimit.max_picks} over ${pickLimit.max_picks}`)
        } else {
            alert('IT WORKED?')
        }
    }

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
}