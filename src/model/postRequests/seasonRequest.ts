export class SeasonRequest {
    season:     number | null;
    seasonType: number | null;
    week:       number | null;

    constructor(
        season:     number | null,
        seasonType: number | null,
        week:       number | null
        ) {

        this.season = season;
        this.seasonType = seasonType;
        this.week = week;

    }
}