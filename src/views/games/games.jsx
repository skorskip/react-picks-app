import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { fetchPicks } from '../../controller/picks/picksSlice';
import { GameDashboard } from './components/game-dashboard/game-dashboard';
import { PicksDashboard } from './components/picks-dashboard/picks-dashboard';

export const Games = () => {
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status)
    const dispatch = useDispatch();

    useEffect(() => {
        if(userState === 'complete') {
            dispatch(fetchGames({ season: '2019', seasonType: '2', week: '7', user: user[0] }));
            dispatch(fetchPicks({ season: '2019', seasonType: '2', week: '7', user: user[0] }));
        }
    }, [userState, dispatch, user]);

    return (
        <>
            <GameDashboard />
            <PicksDashboard />
        </>
    );
}