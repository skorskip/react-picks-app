import { useHistory } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { ButtonType, PickButton } from "../../common/PickButton/PickButton";
import { Game, GameStatusEnum, GameWinStatusEnum } from "../../model/week/game";
import { Pick } from "../../model/week/pick";
import { Team } from "../../model/week/team";
import { formatDate, gameTimeStatusQuarters } from "../../utils/dateFormatter";
import { pickResult } from "../../utils/tools";
import { GameLoader } from "../game-loader/game-loader";
import "./pick-mini.scss";

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
                return (<div className="success-color">
                        <Icon className="pick-mini-status-icon" name="check"/>
                    </div>);
            case GameWinStatusEnum.loss:
                return (<div className="failure-color">
                        <Icon className="pick-mini-status-icon" name="times"/>
                    </div>);
            case GameWinStatusEnum.push:
                return (<div className="secondary-color">
                        <Icon className="pick-mini-status-icon" name="exchange"/>
                    </div>);
            default:
                return;
        }
    }

    enum winnginStatusEnum {
        NEUTRAL='neutral',
        FAILURE='failure',
        SUCCESS='success'
    }


    const winningStatus = (score: number) => {
        if (score === 0) return winnginStatusEnum.NEUTRAL;
        if (score < 0) return winnginStatusEnum.FAILURE;
        return winnginStatusEnum.SUCCESS;
    }

    const gameScore = (pick: Pick, game: Game) => {
        const isHomeTeam = pick.team_id === game.home_team_id;
        const homeScore = ((game.home_team_score || 0) + parseFloat(String(game.home_spread)));
        const awayScore = (game.away_team_score || 0);
        const score = (isHomeTeam) ? (homeScore - awayScore) : (awayScore - homeScore);
        const status = winningStatus(score);

        if (game.game_status !== GameStatusEnum.unplayed) {
            return (
                <div className={"pick-mini-score pick-mini-score-ats status-" + status}>
                    {
                        // if game complete show pick status
                        (game.game_status === GameStatusEnum.completed) ?
                        pickStatus(pick, game) :
                        // if game has no score show --
                        (status === winnginStatusEnum.NEUTRAL) ?
                        '--' : 
                        // if the team picked is losing show down caret
                        (status === winnginStatusEnum.FAILURE) ?
                        (<div className="failure-color pick-mini-score-time">
                            <div className="pick-mini-score-icon">
                                <Icon name="caret down"/>
                            </div>
                        </div>) :
                        (<div className="success-color pick-mini-score-time">
                            <div className="pick-mini-score-icon">
                                <Icon name="caret up"/>
                            </div>
                        </div>)
                    }
                    <div className="pick-mini-score-number">
                        <div className="pick-mini-score-number-diff">{score}</div>
                        <div>ATS</div>
                    </div>
                </div>
            )
        }

        return (<div className="pick-mini-score pick-mini-score-ats status-neutral">
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
                        <div className={'pick-mini-team '  + (parseFloat(spread.toString()) > 0 ? "success-color" : "failure-color") }>
                            {parseFloat(spread).toFixed(1)}
                        </div>
                    </div>
                    <div>
                        {gameScore(pick, game)}
                    </div>
                    <div className="pick-mini-score secondary-color">
                        <div className="secondary-color">
                            {
                                game.game_status === GameStatusEnum.unplayed ? 
                                formatDate(new Date(game.pick_submit_by_date)) : 
                                gameTimeStatusQuarters(game, true)
                            }
                        </div>
                    </div>
                </div>
            )
        })) : 
    (
        <div className="tiertary-color empty">
            <PickButton 
                type={ButtonType.SECONDARY}
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