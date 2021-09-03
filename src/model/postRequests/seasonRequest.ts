export class SeasonRequest {
    season: Number;
    seasonType: Number;
    week: Number;

    constructor(season, seasonType, week) {
        this.season = season;
        this.seasonType = seasonType;
        this.week = week;

    }
}