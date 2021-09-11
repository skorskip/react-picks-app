import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPicksById } from '../../../../controller/picks/picksSlice';
import { selectGamesById, selectTeamById } from '../../../../controller/games/gamesSlice';
import { GameCard } from '../../../../components/game-card/game-card';
import { Pick } from '../../../../model/pick/pick';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';

type Props = {
    id: number,
    previousId: number,
    index: number,
    userId: number,
    onTeamSelected: (select: PickSelected)=> void,
    inEditMode: boolean,
    onDelete: (pick: Pick) => void
}

export const PicksDashboardWrapper = ({ 
    id, 
    previousId, 
    index,
    userId,
    onTeamSelected,
    inEditMode,
    onDelete
}: Props) => {

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
        <GameCard
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
            onTeamSelected={(event:PickSelected) => onTeamSelected(event)}
            onDeleteClicked={() => deleteClicked()}
        />
    )
}