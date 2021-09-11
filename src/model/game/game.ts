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

    constructor(
        game_id:                    number,
        week:                       number,
        season:                     number,
        start_time:                 string,
        pick_submit_by_date:        string,
        home_team_id:               number,
        away_team_id:               number,
        home_team_score:            number,
        away_team_score:            number,
        home_spread:                number,
        game_status:                string,
        winning_team_id:            number,
        current_quarter:            number,
        seconds_left_in_quarter:    number
    ) {
        this.game_id = game_id;
        this.week = week;
        this.season = season;
        this.start_time = start_time;
        this.pick_submit_by_date = pick_submit_by_date;
        this.home_team_id = home_team_id;
        this.away_team_id = away_team_id;
        this.home_team_id = home_team_id;
        this.home_team_score = home_team_score;
        this.away_team_score = away_team_score;
        this.home_spread = home_spread;
        this.game_status = game_status;
        this.winning_team_id = winning_team_id;
        this.current_quarter = current_quarter;
        this.seconds_left_in_quarter = seconds_left_in_quarter;
    }
}