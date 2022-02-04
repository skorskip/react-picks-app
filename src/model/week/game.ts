export const GameStatusEnum = {
    completed: "COMPLETED",
    live: "LIVE",
    unplayed: "UNPLAYED"
};

export const GameWinStatusEnum = {
    win: "WIN",
    loss: "LOSS",
    push: "PUSH"
}

export class Game {

    game_id:                    number;
    week:                       number;
    season:                     number;
    start_time:                 string;
    pick_submit_by_date:        string;
    home_team_id:               number;
    away_team_id:               number;
    home_team_score:            number;
    away_team_score:            number;
    home_spread:                number;
    game_status:                string;
    winning_team_id:            number;
    current_quarter:            number;
    seconds_left_in_quarter:    number;   

    constructor() {
        this.game_id = 0;
        this.week = 0;
        this.season = 0;
        this.start_time = "";
        this.pick_submit_by_date = "";
        this.home_team_id = 0;
        this.away_team_id = 0;
        this.home_team_id = 0;
        this.home_team_score = 0;
        this.away_team_score = 0;
        this.home_spread = 0;
        this.game_status = "";
        this.winning_team_id = 0;
        this.current_quarter = 0;
        this.seconds_left_in_quarter = 0;
    }
}