export const PickSubmitEnum = {
    NO_PICKS : 'NO_PICKS',
    PASS_SUBMIT_DATE : 'PASS_SUBMIT_DATE',
    TOO_MANY_PICKS: 'TOO_MANY_PICKS'
}

export class Pick {

    pick_id: Number;
    user_id: Number;
    game_id: Number;
    team_id: Number;
    submitted_date: String;
    pick_submit_by_date: Date;

    constructor(
        pick_id,
        user_id,
        game_id,
        team_id,
        pick_submit_by_date
    ) {
        this.pick_id = pick_id;
        this.user_id = user_id;
        this.game_id = game_id;
        this.team_id = team_id;
        this.submitted_date = new Date().toISOString();
        this.pick_submit_by_date = pick_submit_by_date;
    }
}