import { Pick } from "../model/week/pick";
import { PickSelected } from "../model/pickSelected/pickSelected";
import { User } from "../model/user/user";

const localDataEnum = {
    STAGED_PICKS: "stagedPicks",
    USER: "user",
    TOKEN: "token",
    THEME: "theme",
    REMIND: "remind",
    ANNOUNCEMENT_CHECK: "announcementCheck",
    LIVE_THREAD_CHECK: "liveThreadCheck"
}

export const setRemindLocal = (remindDate: string) => {
    let dates = localStorage.getItem(localDataEnum.REMIND)
    if(dates) {

        let reminders = JSON.parse(dates) as string[];

        if(reminders.includes(remindDate)) {
            return false;
        }

        let diff = Math.abs(new Date(reminders[0]).getTime() - new Date().getTime());
        if((diff / (1000 * 60 * 60 *24) > 7)) {
            reminders = [];
        }

        reminders.push(remindDate);
        localStorage.setItem(localDataEnum.REMIND, JSON.stringify(reminders));
        return true;


    } else {
        let newDates = [];
        newDates.push(remindDate);
        localStorage.setItem(localDataEnum.REMIND, JSON.stringify(newDates));
    
        return true;
    }


}

export const setStagedPicksLocal = (stagedPicks: Pick[], newPick: PickSelected) => {

    let pickObject = newPick.pick;
    let updated = stagedPicks.filter(pick => pick.game_id !== pickObject.game_id)

    if(newPick.highlight) {
        updated.push(pickObject);
    }

    localStorage.setItem(localDataEnum.STAGED_PICKS, JSON.stringify(updated));
    return updated;
}

export const resetStagedPicksLocal = () => {
    localStorage.setItem(localDataEnum.STAGED_PICKS, "");
}

export const getStagedPicksLocal = () => {
    let stagedStr = localStorage.getItem(localDataEnum.STAGED_PICKS);
    if(stagedStr){
        let staged = JSON.parse(stagedStr) as Pick[];
        return staged?.filter(pick => new Date(pick.pick_submit_by_date) > new Date())
    } else {
        return [] as Pick[];
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