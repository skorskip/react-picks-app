import React from 'react';
import { useSelector } from 'react-redux';
import { selectGamesById } from '../../../../controller/games/gamesSlice';
import './game-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { Game } from '../game/game';

export const GameDashboard = () => {

    const gamesIds = useSelector(selectGamesById);
    const loader = useSelector((state) => state.games.status);

    if(loader === 'loading') {
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
            <Game 
                id={gameId} 
                previousId={gamesIds[index - 1 ]}
                index={index}
            />
        )
    });

    return (
        <div className="games-container">
            <ul>
                { noGames }
                { games }
            </ul>
        </div>
    );
} 