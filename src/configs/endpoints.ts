import {environment} from './environment';

export const endpoints = {
    PICKS : {
        BASE: `${environment.picksServiceURL}picks/`,
        ADD : `${environment.picksServiceURL}picks/create/`,
        DELETE : `${environment.picksServiceURL}picks/delete`,
        UPDATE: `${environment.picksServiceURL}picks/update`,
        BY_WEEK: `${environment.picksServiceURL}picks/week`,
        OTHERS_BY_WEEK: `${environment.picksServiceURL}picks/others`,
        ALL_PICKS_BY_WEEK: `${environment.picksServiceURL}picks/games`
    },
    MESSAGES : {
        BASE: `${environment.messageServiceURL}message/`,
        ANNOUNCEMENTS: `${environment.messageServiceURL}message/announcements`,
        ACTIVE_CHAT: `${environment.messageServiceURL}message/active-thread`,
        SET_REMINDER: `${environment.messageServiceURL}message/set-reminder`

    },
    GAMES : {
        BASE: `${environment.weekServiceURL}week`
    },
    LEAGUE : {
        BASE : `${environment.leagueServiceURL}league`,
        SETTINGS: `${environment.leagueServiceURL}league/settings`
    },
    USERS : {
        BASE : `${environment.userServiceURL}users`,
        LOGIN : `${environment.userServiceURL}users/login`,
        PICK_LIMIT : `${environment.userServiceURL}users/userPicksLimit`,
        STANDINGS : `${environment.userServiceURL}users/standings`,
        DETAILS : `${environment.userServiceURL}users/details`
    }
}