import React from 'react';
import { useSelector } from 'react-redux';
import { selectGamesById } from '../../../../controller/games/gamesSlice';
import { gameTimeStatusQuarters, formatDate } from '../../../../utils/dateFormatter';
import { Team } from '../../../../components/team/team';
import './game.css';

export const Game = ({ id, previousId, index }) => {
    const game = useSelector((state) => selectGamesById(state, id));
    const previousGame = useSelector((state) => selectGamesById(state, previousId));

    const showSubmitTime = () => {
        if((index === 0) || previousGame.pick_submit_by_date !== game.pick_submit_by_date ) {
            return new Date(game.pick_submit_by_date ) > new Date();
        } else return false;
    }

    const unpickable = () => {
        return new Date(game.pick_submit_by_date) <= new Date();
    }

    const fillTeam = (teamId) => {
        return teamId === game.winning_team_id;
    }

    const submitBy = showSubmitTime() && (
        <div className='full-row'>
            <div className="game-card-date">
                <div className="date-text primary">
                    Submit by: { formatDate(new Date(game.pick_submit_by_date)) }
                </div>
            </div>
        </div>
    );

    const timeStatus = unpickable && (
        <div className="game-card-date">
            <div className="date-text accent">
                { gameTimeStatusQuarters(game) }
            </div>
        </div>
    );

    const gameItem =  (
        <div className="game-card base-background tiertary">
            { timeStatus }
            <div className="team-group secondary">
                <Team 
                    id={game.away_team_id}
                    score={game.away_team_score}
                    highlight='false'
                    locked={unpickable}
                    fill={fillTeam(game.away_team_id)}
                />
                <Team 
                    id={game.home_team_id}
                    score={game.home_team_score}
                    highlight='false'
                    locked={unpickable}
                    fill={fillTeam(game.home_team_id)}
                    spread={game.home_spread}
                />
            </div>
        </div>
    )

    return (
        <>
            { submitBy }
            { gameItem }
        </>
    )

}