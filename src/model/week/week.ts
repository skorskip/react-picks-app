import { Game } from "./game";
import { Pick } from "./pick";
import { PicksUserData } from "./picksUserData";
import { Team } from "./team";

export class Week {
    week        : number;
    season      : number;
    seasonType  : number;
    games       : Game[];
    teams       : Team[];
    picks       : Pick[];
    userPicks   : PicksUserData[];

    constructor(
        week        : number,
        season      : number,
        seasonType  : number,
        games       : Game[],
        teams       : Team[],
        picks       : Pick[],
        userPicks   : PicksUserData[]
    ){
        this.week = week;
        this.season = season;
        this.seasonType = seasonType;
        this.games = games;
        this.teams = teams;
        this.picks = picks;
        this.userPicks = userPicks;
    }

}