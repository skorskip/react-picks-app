import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { GameDashboard } from './components/game-dashboard/game-dashboard';

export const Games = () => {
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status)
    const gameDispatch = useDispatch();

    useEffect(() => {
        if(userState === 'complete') {
            gameDispatch(fetchGames({ season: '2019', seasonType: '2', week: '7', user: user[0] }));
        }
    }, [userState, gameDispatch, user]);

    return (
        <>
            <GameDashboard />
        </>
    );
}