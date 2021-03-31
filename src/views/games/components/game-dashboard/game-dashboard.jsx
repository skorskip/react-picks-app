import React from 'react';
import { useSelector } from 'react-redux';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import './game-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';

export const GameDashboard = () => {

    const gamesIds = useSelector(selectGameIds);
    const loader = useSelector((state) => state.games.status);

    if(loader === 'loading' || gamesIds === undefined) {
        return (
            <PickLoader />
        )
    }

    const noGames = gamesIds.size === 0 && (
        <div className="no-games-set secondary">
            No Unpicked Games
        </div>
    );

    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
            />
        )
    });

    return (
        <div className="games-container">
            { noGames }
            { games }
        </div>
    );
} 