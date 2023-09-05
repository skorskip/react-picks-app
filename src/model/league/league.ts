export class MessageSource {
    channel: string;
    chatChannel: string;

    constructor(channel: string, chatChannel: string) {
        this.channel=channel;
        this.chatChannel = chatChannel;
    }
    
}

export class Bonus {
    currentPotAmt: number;
    constructor(currentPotAmt: number){this.currentPotAmt = currentPotAmt};
}

export class League {

    currentWeek:        number;
    currentSeason:      number;
    maxTotalPicks:      number;
    currentSeasonType:  number;
    messageSource:      MessageSource;
    maxSeasonWeek:      number;
    bonus:              Bonus;

    constructor(
        currentWeek:        number,
        currentSeason:      number,
        maxTotalPicks:      number,
        currentSeasonType:  number,
        messageSource:      MessageSource,
        maxSeasonWeek:      number,
        bonus:              Bonus

    ) {
        this.currentWeek = currentWeek;
        this.currentSeason = currentSeason;
        this.maxTotalPicks = maxTotalPicks;
        this.currentSeasonType = currentSeasonType;
        this.maxSeasonWeek = maxSeasonWeek;
        this.messageSource = messageSource;
        this.bonus = bonus;
    }
}