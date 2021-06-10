import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { addPicks, selectPicksGamesIds } from '../../../../controller/picks/picksSlice';
import { selectGameIds } from '../../../../controller/games/gamesSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { GameDashboardWrapper } from './game-dashboard-wrapper';
import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import './game-dashboard.css';

export const GameDashboard = () => {
    const user = useSelector(selectUser);
    const selectedGames = useSelector(selectGameIds);
    const selectedPicksGames = useSelector(selectPicksGamesIds);
    const gamesIds = selectedGames.filter(gameId => !selectedPicksGames.includes(gameId));
    const gameLoader = useSelector((state) => state.games.status);
    const pickLoader = useSelector((state) => state.picks.status);
    const initialStaged = JSON.parse(localStorage.getItem("stagedPicks"));
    const [stagedPicks, setStagedPicks] = useState(
        initialStaged === null ? {} : initialStaged 
    );
    const [stagedCount, setStagedCount] = useState(initialStaged === null ? 0 : Object.keys(initialStaged).length);
    const dispatch = useDispatch();
    const history = useHistory();

    const teamSelected = (event) => {
        let updated = stagedPicks;
        if(event.highlight) {
            let newPick = {
                game_id: event.gameId,
                team_id: event.teamId,
                submitted_date: new Date().toISOString(),
                user_id: user.user_id
            }

            updated[event.gameId] = newPick;
        } else {
            delete updated[event.gameId]
        }
        localStorage.setItem("stagedPicks", JSON.stringify(updated));
        setStagedCount(Object.keys(updated).length);
        setStagedPicks(updated);
    }

    const submitPicks = () => {
        //check to make sure all picks are not pasted submit by date
        //check to make sure within the pick limit
        //check to make sure selected picks is > 1
        setStagedPicks({});
        setStagedCount(0);
        localStorage.setItem("stagedPicks", null);
        dispatch(addPicks({ picks: Object.values(stagedPicks) }));
        history.push("/games/pick");
    }

    const noGames = gamesIds.length === 0 && (
        <div className="no-games-set secondary-color">
            No Unpicked Games
        </div>
    );
    
    const getSubmitClass = () => {
        return (stagedCount > 0) ? "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const games = gamesIds.map((gameId, index) => {
        return(
            <GameDashboardWrapper
                key={"game-wrapper-" + gameId}
                id={gameId} 
                previousId={gamesIds[index - 1]}
                index={index}
                picked={initialStaged === null ? null : initialStaged[gameId]}
                onTeamSelected={teamSelected}
            />
        )
    });

    if(gameLoader === 'loading' || gamesIds === undefined || pickLoader === 'loading') {
        return (<GameLoader height="110" count="8"/>)
    }

    return (
        <div className="games-container page">
            { noGames }
            { games }
            <div className={getSubmitClass()}>
                <Button className="primary-background base-color submit-button" onClick={submitPicks}>
                    Submit ({stagedCount})
                </Button>
            </div>
        </div>
    );
} 