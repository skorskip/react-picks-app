export class UserDetails {
    user_id         : Number;
    user_type       : String;
    max_picks       : Number;
    picks_penalty   : Number;
    pending_picks   : Number;
    picks           : Number;
    ranking         : Number;
    wins            : Number;
    win_pct         : Number;

    constructor(
        user_id      ,
        user_type    ,
        max_picks    ,
        picks_penalty,
        pending_picks,
        picks        ,
        ranking      ,
        wins         ,
        win_pct      
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