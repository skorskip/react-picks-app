import { Team } from '../week/team';
import { Game } from '../week/game';
import { Pick } from '../week/pick';

export class PicksUser {
    game: Game;
    awayTeam: Team;
    homeTeam: Team;
    pick: Pick;
    winning_team_id: number;
    game_status: string;
    pick_submit_by_date: string;

    constructor(
        game: Game, 
        awayTeam: Team, 
        homeTeam: Team, 
        pick: Pick, 
        winning_team_id: number, 
        game_status: string,
        pick_submit_by_date: string) {

            this.game = game;
            this.awayTeam = awayTeam;
            this.homeTeam = homeTeam;
            this.pick = pick;
            this.winning_team_id = winning_team_id;
            this.game_status = game_status;
            this.pick_submit_by_date = pick_submit_by_date;
    }

}