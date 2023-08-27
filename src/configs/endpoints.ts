import { PickRequest } from '../model/postRequests/pickRequest';
import { SeasonRequest } from '../model/postRequests/seasonRequest';
import {environment} from './environment';

export const endpoints = {
    PICKS : {
        BASE: `${environment.picksServiceURL}picks/`,
        ADD : (param: PickRequest) => `${environment.picksServiceURL}picks/create/${param.user_id}`,
        DELETE : `${environment.picksServiceURL}picks/delete`,
        UPDATE: `${environment.picksServiceURL}picks/update`,
        DELETE_WEEK: (params: PickRequest) => `${environment.picksServiceURL}picks/week/delete?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&user=${params.user_id}`,
        OTHERS_BY_WEEK: (params: PickRequest) => `${environment.picksServiceURL}picks/others?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&user=${params.user_id}`,
    },
    MESSAGES : {
        BASE: `${environment.messageServiceURL}message/`,
        ANNOUNCEMENTS: `${environment.messageServiceURL}message/announcements`,
        ACTIVE_CHAT: `${environment.messageServiceURL}message/active-thread`,
        SET_REMINDER: `${environment.messageServiceURL}message/set-reminder`
    },
    GAMES : {
        BASE: `${environment.weekServiceURL}week`,
        WEEK: (param: SeasonRequest) => `${environment.weekServiceURL}week?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`
    },
    LEAGUE : {
        BASE : `${environment.leagueServiceURL}league`,
        SETTINGS: `${environment.leagueServiceURL}league/settings`
    },
    USERS : {
        BASE : `${environment.userServiceURL}users`,
        LOGIN : `${environment.userServiceURL}users/login`,
        STANDINGS : (params: SeasonRequest) => `${environment.userServiceURL}users/standings?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`,
        UPDATE_PROFILE: `${environment.userServiceURL}users/update-user-profile`,
        BONUS_USERS:  (params: SeasonRequest) => `${environment.userServiceURL}users/bonus-streak?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`,
        UPDATE_SLACK_ID: `${environment.userServiceURL}users/add-slack-id`
    }
}