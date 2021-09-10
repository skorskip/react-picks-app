export class PicksUserData {
    pick_id: Number;
    game_id: Number;
    team_id: Number;
    user_id: Number;
    user_inits: String;
    first_name: String;
    last_name: String;
    pick_submit_by_date: String;

    constructor(
        pick_id,
        game_id,
        team_id,
        user_id,
        user_inits,
        first_name,
        last_name,
        pick_submit_by_date
    ){
        this.pick_id = pick_id;
        this.game_id = game_id;
        this.team_id = team_id;
        this.user_id = user_id;
        this.user_inits = user_inits;
        this.first_name = first_name;
        this.last_name = last_name;
        this.pick_submit_by_date = pick_submit_by_date; 
    }
}