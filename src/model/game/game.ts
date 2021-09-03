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

    game_id: Number;
    week: Number;
    season: Number;
    start_time: Date;
    pick_submit_by_date: Date;
    home_team_id: Number;
    away_team_id: Number;
    home_team_score: Number;
    away_team_score: Number;
    home_spread: Number;
    game_status: String;
    winning_team_id: Number;
    current_quarter: String;
    seconds_left_in_quarter: String;   

    constructor(
        game_id,
        week,
        season,
        start_time,
        pick_submit_by_date,
        home_team_id,
        away_team_id,
        home_team_score,
        away_team_score,
        home_spread,
        game_status,
        winning_team_id,
        current_quarter,
        seconds_left_in_quarter
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