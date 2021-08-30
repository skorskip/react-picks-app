const localDataEnum = {
    STAGED_PICKS: "stagedPicks",
    USER: "user",
    TOKEN: "token",
    THEME: "theme",
    ANNOUNCEMENT_CHECK: "announcementCheck",
    LIVE_THREAD_CHECK: "liveThreadCheck"
}

export const setStagedPicksLocal = (stagedPicks, newPick) => {

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
    localStorage.setItem(localDataEnum.STAGED_PICKS, null);
}

export const getStagedPicksLocal = () => {
    if(localStorage.getItem(localDataEnum.STAGED_PICKS) != null){
        return JSON.parse(localStorage.getItem(localDataEnum.STAGED_PICKS));
    } else {
        return null;
    }
}

export const setUserLocal = (user) => {
    localStorage.setItem(localDataEnum.USER, JSON.stringify(user));
}

export const getUserLocal = () => {
    if(localStorage.getItem(localDataEnum.USER)){
        return JSON.parse(localStorage.getItem(localDataEnum.USER));
    } else {
        return null;
    }
}

export const getTokenLocal = () => {
    return localStorage.getItem(localDataEnum.TOKEN); 
}

export const setTokenLocal = (token) => {
    localStorage.setItem(localDataEnum.TOKEN, token);
}

export const setThemeLocal = (theme) => {
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