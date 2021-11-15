export class PicksUserData {
    pick_id:                number;
    game_id:                number;
    team_id:                number;
    user_id:                number;
    user_inits:             string;
    slack_user_image:       string;
    first_name:             string;
    last_name:              string;
    pick_submit_by_date:    string;

    constructor(
        pick_id:                number,
        game_id:                number,
        team_id:                number,
        user_id:                number,
        user_inits:             string,
        slack_user_image:       string,
        first_name:             string,
        last_name:              string,
        pick_submit_by_date:    string
    ){
        this.pick_id = pick_id;
        this.game_id = game_id;
        this.team_id = team_id;
        this.user_id = user_id;
        this.user_inits = user_inits;
        this.slack_user_image = slack_user_image;
        this.first_name = first_name;
        this.last_name = last_name;
        this.pick_submit_by_date = pick_submit_by_date; 
    }
}