export class UserStanding {

    user_id:        number;
    ranking:        number;
    user_inits:     string; 
    user_name:      string; 
    first_name:     string; 
    last_name:      string; 
    wins:           number;
    picks:          number;
    win_pct:        number;
    pending_picks:  number;
    bonus_nbr:      number;
    prev_ranking:   number;
    date:           Date;

    constructor(
        user_id:        number,
        ranking:        number,
        user_inits:     string,
        user_name:      string,
        first_name:     string,
        last_name:      string,
        wins:           number,
        picks:          number,
        win_pct:        number,
        pending_picks:  number,
        bonus_nbr:      number,
        prev_ranking:   number,
        date:           Date
    ) {

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