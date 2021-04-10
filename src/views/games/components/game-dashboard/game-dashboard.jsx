import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import './game-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';
import { useState } from 'react/cjs/react.development';

export const GameDashboard = () => {
    const user = useSelector(selectUser);
    const gamesIds = useSelector(selectGameIds);
    const loader = useSelector((state) => state.games.status);
    const initialStaged = JSON.parse(localStorage.getItem("stagedPicks"));
    const [stagedPicks, setStagedPicks] = useState(
        initialStaged === null ? {} : initialStaged 
    );


    const teamSelected = (event) => {
        let updated = stagedPicks;
        if(event.highlight) {
            let newPick = {
                game_id: event.gameId,
                team_id: event.teamId,
                submitted_date: new Date(),
                user_id: user.user_id
            }

            updated[event.gameId] = newPick;
        } else {
            delete updated[event.gameId]
        }
        localStorage.setItem("stagedPicks", JSON.stringify(updated));
        setStagedPicks(updated);
    }

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

    //TODO:: Add arg to pass stagedPick to highlight
    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
                picked={initialStaged === null ? null : initialStaged[gameId]}
                onTeamSelected={teamSelected}
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