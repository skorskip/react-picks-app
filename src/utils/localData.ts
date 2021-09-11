import { Pick } from "../model/pick/pick";
import { PickSelected } from "../model/pickSelected/pickSelected";
import { User } from "../model/user/user";

const localDataEnum = {
    STAGED_PICKS: "stagedPicks",
    USER: "user",
    TOKEN: "token",
    THEME: "theme",
    ANNOUNCEMENT_CHECK: "announcementCheck",
    LIVE_THREAD_CHECK: "liveThreadCheck"
}

export const setStagedPicksLocal = (stagedPicks: Pick[], newPick: PickSelected) => {

    let pickObject = newPick.pick;
    let updated = stagedPicks;

    if(newPick.highlight) {
        updated[pickObject.game_id] = pickObject;
    } else {
        delete updated[pickObject.game_id];
    }

    localStorage.setItem(localDataEnum.STAGED_PICKS, JSON.stringify(updated));
    return updated;
}

export const resetStagedPicksLocal = () => {
    localStorage.setItem(localDataEnum.STAGED_PICKS, "");
}

export const getStagedPicksLocal = () => {
    let staged = localStorage.getItem(localDataEnum.STAGED_PICKS)
    if(staged != null){
        return JSON.parse(staged);
    } else {
        return null;
    }
}

export const setUserLocal = (user: User) => {
    localStorage.setItem(localDataEnum.USER, JSON.stringify(user));
}

export const getUserLocal = () => {
    let user = localStorage.getItem(localDataEnum.USER)
    if(user){
        return JSON.parse(user);
    } else {
        return null;
    }
}

export const getTokenLocal = () => {
    return localStorage.getItem(localDataEnum.TOKEN); 
}

export const setTokenLocal = (token: string) => {
    localStorage.setItem(localDataEnum.TOKEN, token);
}

export const setThemeLocal = (theme: string) => {
    localStorage.setItem(localDataEnum.THEME, theme);
}

export const getThemeLocal = () => {
    return localStorage.getItem(localDataEnum.THEME);
}

export const resetLiveThreadCheckLocal = () => {
    localStorage.setItem(localDataEnum.LIVE_THREAD_CHECK, new Date().toUTCString());
}

export const getLiveThreadCheckLocal = () => {
    return localStorage.getItem(localDataEnum.LIVE_THREAD_CHECK)
}

export const resetAnnouncementCheckLocal = () => {
    localStorage.setItem(localDataEnum.ANNOUNCEMENT_CHECK, new Date().toUTCString())
}

export const getAnnouncementCheckLocal = () => {
    return localStorage.getItem(localDataEnum.ANNOUNCEMENT_CHECK)
}

export const clearAllLocal = () => {
    localStorage.clear();
}