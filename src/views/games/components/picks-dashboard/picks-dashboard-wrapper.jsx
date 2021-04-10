import React from 'react';
import { useSelector } from 'react-redux';
import { selectPicksGameById, selectPicksTeamById, selectPicksById } from '../../../../controller/picks/picksSlice';
import { Game } from '../game/game';

export const PicksDashboardWrapper = ({ id, previousId, index, onTeamSelected}) => {

    const pick = useSelector((state) => selectPicksById(state, id))
    const previousPick = useSelector((state) => selectPicksById(state, previousId));
    const game = useSelector((state) => selectPicksGameById(state, pick.game_id));
    const previousGame = useSelector((state) => {
        if(previousPick !== undefined){selectPicksGameById(state, previousPick.game_id)}
    });
    
    const homeTeam = useSelector((state) => selectPicksTeamById(state, game.home_team_id));
    const awayTeam = useSelector((state) => selectPicksTeamById(state, game.away_team_id))

    const showSubmitTime = () => {
        if(previousGame !== undefined && ((index === 0) || previousGame.pick_submit_by_date !== game.pick_submit_by_date)) {
            return new Date(game.pick_submit_by_date ) > new Date();
        } else return false;
    }

    return(
        <Game
            key={id}
            game={game}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            pick={pick}
            showSubmitTime={showSubmitTime()}
            disabled={true}
            onTeamSelected={(event) => onTeamSelected(event)}
        />
    )
}