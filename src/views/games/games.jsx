import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { GameDashboard } from './components/game-dashboard/game-dashboard';
export const Games = () => {
    const user = useSelector(selectUser);
    const gameDispatch = useDispatch();
    const getGames = () => {
        gameDispatch(fetchGames('2019', '2', '7', user));
    }

    useEffect(() => {getGames()}, [user]);

    return (
        <>
            <GameDashboard />
        </>
    );

}