import { Icon } from "semantic-ui-react";
import { Game, GameStatusEnum, GameWinStatusEnum } from "../../model/week/game";
import { Pick } from "../../model/week/pick"
import { Team } from "../../model/week/team";
import { pickResult } from "../../utils/tools";
import "./pick-mini.scss";
import { gameTimeStatusQuarters } from "../../utils/dateFormatter";
import { useHistory } from "react-router-dom";
import { PickButton } from "../../common/PickButton/PickButton";
import { GameLoader } from "../game-loader/game-loader";

type Props = {
    picks: Array<Pick>,
    games: Array<Game>,
    teams: Array<Team>,
    isLoading: boolean
}

export const PickMini = ({picks, games, teams, isLoading}: Props) => {
    const history = useHistory();

    const pickStatus = (pick: Pick, game: Game) => {
        const status = pickResult(game, pick);
        switch(status) {
            case GameWinStatusEnum.win:
                return (<div className="pick-mini-icon success-color">
                        <Icon className="pick-mini-status-icon" name="check"/>
                    </div>);
            case GameWinStatusEnum.loss:
                return (<div className="pick-mini-icon failure-color">
                        <Icon className="pick-mini-status-icon" name="times"/>
                    </div>);
            case GameWinStatusEnum.push:
                return (<div className="pick-mini-icon secondary-color">
                        <Icon className="pick-mini-status-icon" name="exchange"/>
                    </div>);
            default:
                return;
        }
    }

    const gameScore = (pick: Pick, game: Game) => {
        const isHomeTeam = pick.team_id === game.home_team_id;
        const score = game.home_team_score - game.away_team_score;

        if (game.game_status === GameStatusEnum.live) {
            return (<div>
                {
                    (game.away_team_score === 0 && game.home_team_score === 0) ?
                    'No score yet' : 
                    (score === 0) ?
                    'All tied up' :
                    (score < 0 && isHomeTeam || score > 0 && !isHomeTeam) ?
                    (<div className="secondary-color pick-mini-score-time"><div className="pick-mini-score-icon"><Icon name="caret down"/></div>{Math.abs(score)}</div>) :
                    (<div className="secondary-color pick-mini-score-time"><div className="pick-mini-score-icon"><Icon name="caret up"/></div>{Math.abs(score)}</div>)
                }
            </div>)
        }

        return (<div>
            {
                (game.game_status === GameStatusEnum.unplayed) ?
                'Unplayed' : 'Game Over'
            }
        </div>);
    }

    const miniPicksCard = ((picks.length > 0) ? (    
        picks.map(pick => {
            const game = games.find(game => game.game_id === pick.game_id);
            const team = teams.find(team => team.team_id === pick.team_id);
            let spread = '';

            if (team?.team_id === game?.home_team_id) {
                spread = String(game?.home_spread) || '';
            } else {
                spread = (game?.home_spread || 0) > 0 ? '-' + game?.home_spread : '+' + Math.abs(game?.home_spread || 0);
            }

            return (game) && (
                <div className="pick-mini-card tiertary-color" onClick={() => history.push(`/games/pick?status=${game.game_status}`)}>
                    <div className="pick-mini-header secondary-color">
                        <div className="pick-mini-spread">
                            {team?.abbreviation}
                        </div>
                        <div>
                            {pickStatus(pick, game)}
                        </div>
                    </div>
                    <div className={'pick-mini-team '  + (parseFloat(spread.toString()) > 0 ? "success-color" : "failure-color") }>
                        {parseFloat(spread).toFixed(1)}
                    </div>
                    <div className="pick-mini-score secondary-color">
                        {gameScore(pick, game)}
                        {
                            (game.game_status === GameStatusEnum.live) &&
                            (<div className="success-color">
                                {gameTimeStatusQuarters(game)}
                            </div>)
                        }
                    </div>
                </div>
            )
        })) : 
    (
        <div className="tiertary-color empty">
            <PickButton 
                type="secondary"
                clickEvent={() => history.push(`/games/game?status=${GameStatusEnum.unplayed}`)}
                content={
                    <div>
                        Make some picks
                        <Icon className="pick-mini-status-icon" name="chevron right"/>
                    </div>
                }/>
        </div>
    ));

    if(isLoading) {
        return (
            <GameLoader height={100} width={150} count={2} rowCount={2}/>
        )
    }

    return (
        <div className="mini-pick-container">
            {miniPicksCard}
        </div>
    );
}