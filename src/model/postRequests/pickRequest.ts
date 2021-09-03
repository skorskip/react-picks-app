import { Pick } from "../pick/pick";

export class PickRequest {
    season: Number;
    seasonType: Number;
    week: Number;
    user_id: Number;
    picks: Pick[]

    constructor(
        season,
        seasonType,
        week,
        user_id,
        picks
    ) {
        this.season = season;
        this.seasonType = seasonType;
        this.week = week;
        this.user_id = user_id;
        this.picks = picks;

    }
}