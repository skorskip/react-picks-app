export const UserTypeEnum = {
    PARTICIPANT: "participant"
}

export class UserCurrentSeasonData {
    max_picks       : number;
    picks_penalty   : number;
    pending_picks   : number;
    picks           : number;
    ranking         : number;
    wins            : number;
    win_pct         : number;
    bonus_nbr       : number;
    prev_ranking    : number;
    dropped_week    : number | null;

    constructor(
        max_picks       : number,
        picks_penalty   : number,
        pending_picks   : number,
        picks           : number,
        ranking         : number,
        wins            : number,
        win_pct         : number,
        bonus_nbr       : number,
        prev_ranking    : number,
        dropped_week    : number | null,
    ) {
        this.max_picks    = max_picks    
        this.picks_penalty= picks_penalty
        this.pending_picks= pending_picks
        this.picks        = picks        
        this.ranking      = ranking
        this.wins         = wins         
        this.win_pct      = win_pct
        this.bonus_nbr    = bonus_nbr
        this.prev_ranking = prev_ranking
        this.dropped_week = dropped_week
    }
}


export class User {

    user_id :               number;
    user_name :             string;
    email :                 string;
    first_name:             string;
    last_name:              string;
    status:                 string;
    type:                   string;
    last_login_date:        Date;
    user_inits:             string;
    slack_user_id:          string;
    slack_user_image:       string;
    current_season_data:    UserCurrentSeasonData;

    constructor(
        user_id :               number,
        user_name :             string,
        email :                 string,
        first_name:             string,
        last_name:              string,
        status:                 string,
        type:                   string,
        last_login_date:        Date,
        user_inits:             string,
        slack_user_id:          string,
        slack_user_image:       string,
        current_season_data:    UserCurrentSeasonData
    ){
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.status = status;
        this.type = type;
        this.last_login_date = last_login_date;
        this.user_inits = user_inits;
        this.slack_user_id = slack_user_id;
        this.slack_user_image = slack_user_image;
        this.current_season_data = current_season_data;
    }
}