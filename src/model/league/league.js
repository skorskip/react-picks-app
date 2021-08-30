export class League {
    constructor(
        currentWeek,
        currentSeason,
        maxTotalPicks,
        seasonStart,
        seasonEndWeek,
        currentSeasonType
    ) {
        this.currentWeek = currentWeek;
        this.currentSeason = currentSeason;
        this.maxTotalPicks = maxTotalPicks;
        this.seasonStart = seasonStart;
        this.seasonEndWeek = seasonEndWeek;
        this.currentSeasonType = currentSeasonType;
    }
}