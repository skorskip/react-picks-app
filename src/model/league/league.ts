export class MessageSource {
    channel: string;
    chatChannel: string;

    constructor(channel: string, chatChannel: string) {
        this.channel=channel;
        this.chatChannel = chatChannel;
    }
    
}

export class League {

    currentWeek:        number;
    currentSeason:      number;
    maxTotalPicks:      number;
    currentSeasonType:  number;
    messageSource:      MessageSource;

    constructor(
        currentWeek:        number,
        currentSeason:      number,
        maxTotalPicks:      number,
        currentSeasonType:  number,
        messageSource:      MessageSource

    ) {
        this.currentWeek = currentWeek;
        this.currentSeason = currentSeason;
        this.maxTotalPicks = maxTotalPicks;
        this.currentSeasonType = currentSeasonType;
        this.messageSource = messageSource;
    }
}