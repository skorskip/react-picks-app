export class UserStanding {

    user_id: Number;
    ranking: Number;
    user_inits: String; 
    user_name: String; 
    first_name: String; 
    last_name: String; 
    wins: Number;
    picks: Number;
    win_pct: Number;
    pending_picks: Number;
    bonus_nbr: Number;
    prev_ranking: Number;
    date: Date;

    constructor(
        user_id, 
        ranking, 
        user_inits, 
        user_name, 
        first_name, 
        last_name, 
        wins, picks, 
        win_pct, 
        pending_picks,
        bonus_nbr,
        prev_ranking,
        date) {

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
        this.bonus_nbr = bonus_nbr;
        this.prev_ranking = prev_ranking;
        this.date = date;
    }
}