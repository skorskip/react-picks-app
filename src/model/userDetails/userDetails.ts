export class UserDetails {
    user_id         : number;
    user_type       : string;
    max_picks       : number;
    picks_penalty   : number;
    pending_picks   : number;
    picks           : number;
    ranking         : number;
    wins            : number;
    win_pct         : number;

    constructor(
        user_id         : number,
        user_type       : string,
        max_picks       : number,
        picks_penalty   : number,
        pending_picks   : number,
        picks           : number,
        ranking         : number,
        wins            : number,
        win_pct         : number
    ) {
        this.user_id      = user_id      
        this.user_type    = user_type    
        this.max_picks    = max_picks    
        this.picks_penalty= picks_penalty
        this.pending_picks= pending_picks
        this.picks        = picks        
        this.ranking      = ranking      
        this.wins         = wins         
        this.win_pct      = win_pct      
    }
}