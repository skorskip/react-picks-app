import React from 'react';
import { gameTimeStatusQuarters, formatDate } from '../../../../utils/dateFormatter';
import { Team } from '../../../../components/team/team';
import { PickStatus } from '../pick-staus/pick-status';
import './game.css';
import { useEffect, useState } from 'react/cjs/react.development';

export const Game = ({ game, homeTeam, awayTeam, pick, showSubmitTime }) => {
    const [highlightHome, setHighlightHome] = useState(false);
    const [highlightAway, setHighlightAway] = useState(false);

    const pickResult = () => {
        if(game.game_status === 'COMPLETED' && pick !== null){
            if(pick.team_id === game.winning_team_id) {
              return "WIN";
            } else if(game.winning_team_id === null) {
              return "PUSH";
            } else {
              return "LOSE";
            }
          }
          else {
            return null;
          }
    }

    const unpickable = () => {
        return new Date(game.pick_submit_by_date) <= new Date();
    }

    const fillTeam = (teamId) => {
        return teamId === game.winning_team_id;
    }

    const submitBy = showSubmitTime && (
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
                    team={awayTeam}
                    score={game.away_team_score}
                    highlight={highlightAway}
                    locked={unpickable()}
                    fill={fillTeam(game.away_team_id)}
                />
                <div className="pick-status base-background">
                    <PickStatus
                        submitTime={game.pick_submit_by_date}
                        pickSuccess={pickResult()}
                    />
                </div>
                <Team 
                    team={homeTeam}
                    score={game.home_team_score}
                    highlight={highlightHome}
                    locked={unpickable()}
                    fill={fillTeam(game.home_team_id)}
                    spread={game.home_spread}
                />
            </div>
        </div>
    );

    useEffect(() => {
        const highlightPicks = () => {
            if(pick !== null) {
                (game.home_team_id === pick.team_id) ? setHighlightHome(true) : setHighlightAway(true)
            }
        };

        highlightPicks();
    }, [pick, game]);

    return (
        <>
            { submitBy }
            { gameItem }
        </>
    )

}