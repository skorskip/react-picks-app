import React from 'react';
import { gameTimeStatusQuarters, formatDate } from '../../../../utils/dateFormatter';
import { Team } from '../../../../components/team/team';
import { PickStatus } from '../pick-staus/pick-status';
import './game.css';
import { useEffect, useState } from 'react/cjs/react.development';
import { GameWinStatusEnum, GameStatusEnum } from '../../../../model/game/game';

export const Game = ({ 
    game, 
    homeTeam, 
    awayTeam, 
    pick, 
    showSubmitTime, 
    disabled,
    editMode,
    remove,
    onTeamSelected }) => {

    const [highlightHome, setHighlightHome] = useState(false);
    const [highlightAway, setHighlightAway] = useState(false);

    const pickResult = () => {
        if(game.game_status === GameStatusEnum.completed && pick !== null && pick !== undefined){
            if(pick.team_id === game.winning_team_id) {
              return GameWinStatusEnum.win;
            } else if(game.winning_team_id === null) {
              return GameWinStatusEnum.push;
            } else {
              return GameWinStatusEnum.lose;
            }
          }
          else {
            return null;
          }
    }

    const gameLocked = () => {
        return new Date(game.pick_submit_by_date) <= new Date();
    }

    const fillTeam = (teamId) => {
        return teamId === game.winning_team_id;
    }

    const teamSelected = (event) => {
        let pickOpt = {
            highlight : event.highlight,
            teamId: event.team.team_id,
            gameId: game.game_id
        }

        if(event.team.team_id === awayTeam.team_id) {
            if(event.highlight) setHighlightHome(false);
            setHighlightAway(event.highlight)
        } else {
            if(event.highlight) setHighlightAway(false);
            setHighlightHome(event.highlight)
        }

        if(editMode) {
            setHighlightAway(highlightHome);
            setHighlightHome(highlightAway);
            if(!event.highlight) {
                pickOpt.teamId = (event.team.team_id === awayTeam.team_id) ? homeTeam.team_id : awayTeam.team_id;
                pickOpt.highlight = true;
            }
        }
        
        onTeamSelected(pickOpt);
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

    const timeStatus = gameLocked && (
        <div className="game-card-date">
            <div className="date-text accent">
                { gameTimeStatusQuarters(game) }
            </div>
        </div>
    );

    const getGameContainerClass = () => {
        return (remove) ? "disable" : "game-card base-background tiertary"
    }

    const gameItem =  (
        <div className={ getGameContainerClass }>
            { timeStatus }
            <div className="team-group secondary">
                <Team 
                    team={awayTeam}
                    score={game.away_team_score}
                    highlight={highlightAway}
                    locked={gameLocked()}
                    fill={fillTeam(game.away_team_id)}
                    disabled={disabled}
                    onTeamSelected={teamSelected}
                />
                <PickStatus
                    submitTime={game.pick_submit_by_date}
                    pickSuccess={pickResult()}
                />
                <Team 
                    team={homeTeam}
                    score={game.home_team_score}
                    highlight={highlightHome}
                    locked={gameLocked()}
                    fill={fillTeam(game.home_team_id)}
                    spread={game.home_spread}
                    disabled={disabled}
                    onTeamSelected={teamSelected}
                />
            </div>
        </div>
    );

    useEffect(() => {
        const highlightPicks = () => {
            if(pick !== null && pick !== undefined) {
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