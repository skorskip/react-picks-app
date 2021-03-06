import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPicksById } from '../../../../controller/picks/picksSlice';
import { selectGamesById, selectTeamById } from '../../../../controller/games/gamesSlice';
import { Game } from '../../../../components/game/game';

export const PicksDashboardWrapper = ({ 
    id, 
    previousId, 
    index,
    userId,
    onTeamSelected,
    inEditMode,
    onDelete
}) => {

    const pick = useSelector((state) => selectPicksById(state, id))
    const previousPick = useSelector((state) => selectPicksById(state, previousId));
    const game = useSelector((state) => selectGamesById(state, pick.game_id));
    const previousGame = useSelector((state) => {
        if(previousPick !== undefined){ return selectGamesById(state, previousPick.game_id)}
    });
    
    const homeTeam = useSelector((state) => selectTeamById(state, game?.home_team_id));
    const awayTeam = useSelector((state) => selectTeamById(state, game?.away_team_id));
    const [removeGame, setRemoveGame] = useState(false);
    const gamePassedEdit = new Date() > new Date(game?.pick_submit_by_date);

    const showSubmitTime = () => {
        if((index === 0) || previousGame?.pick_submit_by_date !== game?.pick_submit_by_date) {
            return new Date(game?.pick_submit_by_date ) > new Date();
        } else return false;
    }

    const deleteClicked = () => {
        onDelete(pick);
        setRemoveGame(true);
    }

    return(
        <Game
            key={"game-" + id}
            game={game}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            pick={pick}
            userId={userId}
            showSubmitTime={showSubmitTime()}
            disabled={(!inEditMode && !gamePassedEdit)}
            editMode={inEditMode}
            remove={removeGame}
            showDeleteButton={(inEditMode && !removeGame && !gamePassedEdit)}
            onTeamSelected={(event) => onTeamSelected(event)}
            onDeleteClicked={() => deleteClicked()}
        />
    )
}