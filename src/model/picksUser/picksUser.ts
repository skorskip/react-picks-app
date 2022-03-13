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

    constructor() {
            this.game = new Game();
            this.awayTeam = new Team(0, "","","","","");
            this.homeTeam = new Team(0, "","","","","");
            this.pick = new Pick(0,0,0,0,"");
            this.winning_team_id = 0
            this.game_status = "";
            this.pick_submit_by_date = "";
    }

}