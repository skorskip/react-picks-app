export class Pick {
    constructor(
        pick_id,
        user_id,
        game_id,
        team_id,
        submitted_date,
    ) {
        this.pick_id = pick_id;
        this.user_id = user_id;
        this.game_id = game_id;
        this.team_id = team_id;
        this.submitted_date = submitted_date;
    }
}