export class PickDeleteRequest {
    season:         number;
    seasonType:     number;
    week:           number;
    user_id:        number;
    picks:          number[];

    constructor(
        season:         number,
        seasonType:     number,
        week:           number,
        user_id:        number,
        picks:          number[]
    ) {
        this.season = season;
        this.seasonType = seasonType;
        this.week = week;
        this.user_id = user_id;
        this.picks = picks;

    }
}