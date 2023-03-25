import { Icon } from "semantic-ui-react";
import { Game, GameWinStatusEnum } from "../../model/week/game";
import { Pick } from "../../model/week/pick"
import { Team } from "../../model/week/team";
import { pickResult } from "../../utils/tools";
import "./pick-mini.css";

type Props = {
    picks: Array<Pick>,
    games: Array<Game>,
    teams: Array<Team>
}

export const PickMini = ({picks, games, teams}: Props) => {
    if (!picks.length) {
        return (<></>);
    }

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

    const miniPicksCard = picks.map(pick => {
        const game = games.find(game => game.game_id === pick.game_id);
        const team = teams.find(team => team.team_id === pick.team_id);
        let spread = '';

        if (team?.team_id === game?.home_team_id) {
            spread = String(game?.home_spread) || '';
        } else {
            spread = (game?.home_spread || 0) > 0 ? '-' + game?.home_spread : '+' + Math.abs(game?.home_spread || 0);
        }

        return (game) && (
            <div className="pick-mini-card tiertary-color">
                <div className="pick-mini-header secondary-color">
                    <div className="pick-mini-spread">
                        {spread}
                    </div>
                    <div>
                        {pickStatus(pick, game)}
                    </div>
                </div>
                <div className="pick-mini-team secondary-color">
                    {team?.team_name}
                </div>
            </div>
        )
    });

    return (
        <div className="mini-pick-container">
            {miniPicksCard}
        </div>
    );
}