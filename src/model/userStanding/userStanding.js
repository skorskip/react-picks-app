export class UserStanding {
    constructor(user_id, ranking, user_inits, user_name, first_name, last_name, wins, picks, win_pct, pending_picks, date) {
        this.user_id = user_id;
        this.ranking = ranking;
        this.user_inits = user_inits;
        this.user_name = user_name;
        this.first_name = first_name;
        this.last_name = last_name;
        this.wins = wins;
        this.picks = picks;
        this.win_pct = win_pct;
        this.pending_picks = pending_picks;
        this.date = date;
    }
}