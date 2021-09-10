import { Team } from '../team/team';
import { Game } from '../game/game';
import { Pick } from '../pick/pick';

export class PicksUser {
    game: Game;
    awayTeam: Team;
    homeTeam: Team;
    pick: Pick;
    winning_team_id: Number;
    game_status: String;

    constructor(
        game, 
        awayTeam, 
        homeTeam, 
        pick, 
        winning_team_id, 
        game_status) {

            this.game = game;
            this.awayTeam = awayTeam;
            this.homeTeam = homeTeam;
            this.pick = pick;
            this.winning_team_id = winning_team_id;
            this.game_status = game_status;
    }

}