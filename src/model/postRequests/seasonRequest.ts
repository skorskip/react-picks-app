export class SeasonRequest {
    season: number;
    seasonType: number;
    week: number;

    constructor(
        season:     number,
        seasonType: number,
        week:       number
        ) {

        this.season = season;
        this.seasonType = seasonType;
        this.week = week;

    }
}