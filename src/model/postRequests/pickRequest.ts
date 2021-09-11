import { Pick } from "../pick/pick";

export class PickRequest {
    season:         number;
    seasonType:     number;
    week:           number;
    user_id:        number;
    picks:          Pick[];

    constructor(
        season:         number,
        seasonType:     number,
        week:           number,
        user_id:        number,
        picks:          Pick[]
    ) {
        this.season = season;
        this.seasonType = seasonType;
        this.week = week;
        this.user_id = user_id;
        this.picks = picks;

    }
}