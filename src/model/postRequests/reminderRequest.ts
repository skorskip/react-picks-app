export class ReminderRequest {
    pick_submit_by_date : string;
    slack_user_id : string;

    constructor(date: string, slack_id: string) {
        this.pick_submit_by_date = date;
        this.slack_user_id = slack_id;
    }

}