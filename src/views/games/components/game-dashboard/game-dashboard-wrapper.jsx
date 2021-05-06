import React from 'react';
import { useSelector } from 'react-redux';
import { selectGamesById, selectTeamById } from '../../../../controller/games/gamesSlice';
import { Game } from '../../../../components/game/game';

export const GameDashboardWrapper = ({ id, previousId, index, picked, onTeamSelected}) => {

    const game = useSelector((state) => selectGamesById(state, id));
    const previousGame = useSelector((state) => selectGamesById(state, previousId));
    const homeTeam = useSelector((state) => selectTeamById(state, game.home_team_id));
    const awayTeam = useSelector((state) => selectTeamById(state, game.away_team_id));

    const showSubmitTime = () => {
        if((index === 0) || previousGame.pick_submit_by_date !== game.pick_submit_by_date ) {
            return new Date(game.pick_submit_by_date ) > new Date();
        } else return false;
    }

    return(
        <Game
            key={"game-" + id}
            game={game}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            pick={picked}
            showSubmitTime={showSubmitTime()}
            disabled={false}
            onTeamSelected={(event) => onTeamSelected(event)}
        />
    )
}