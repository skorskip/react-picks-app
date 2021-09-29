import { Pick } from "../week/pick";

export class PickRequest {
    season:         number | null;
    seasonType:     number | null;
    week:           number | null;
    user_id:        number | null;
    picks:          Pick[];

    constructor(
        season:         number | null,
        seasonType:     number | null,
        week:           number | null,
        user_id:        number | null,
        picks:          Pick[]
    ) {
        this.season = season;
        this.seasonType = seasonType;
        this.week = week;
        this.user_id = user_id;
        this.picks = picks;

    }
}