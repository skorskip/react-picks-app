import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { Game } from '../../model/week/game';
import { Team } from '../../model/week/team';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { RootState } from '../../store';
import { Pick, PickSubmitEnum } from '../../model/week/pick';
import { PicksUserData } from '../../model/week/picksUserData';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { PickDeleteRequest } from '../../model/postRequests/pickDeleteRequest';

const getMessageFromError = (error: any) => {
    let message = error?.message;
    switch (message) {
        case PickSubmitEnum.PASS_SUBMIT_DATE :
            return status.MESSAGE.PICKS.PASS_SUBMIT_DATE;
        case PickSubmitEnum.TOO_MANY_PICKS :
            let message = status.MESSAGE.PICKS.TOO_MANY_PICKS(error.content.data.over, error.content.data.limit);
            return message;
        case PickSubmitEnum.NO_PICKS : 
            return status.MESSAGE.PICKS.NO_PICKS;
        case PickSubmitEnum.NOT_ALLOWED :
            return status.MESSAGE.PICKS.NOT_ALLOWED;
        default :
            return null;
    }
}

const weekAdapter = createEntityAdapter();

const initialState = weekAdapter.getInitialState({
    status: status.IDLE,
    setWeek: null as number | null,
    message: "" as string | null,
    games: [] as Game[],
    teams: [] as Team[],
    picks: [] as Pick[],
    userPicks: [] as PicksUserData[]
});

export const fetchWeek = createAsyncThunk('week/fetchGames',  async (param: SeasonRequest) => {
    try {
        const url = endpoints.GAMES.WEEK(param);
        const response = await client.get(url);
        return { response: response, week: param.week };
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error, week: null}
    }
});

export const addPicks = createAsyncThunk('week/addPicks', async (param: PickRequest) => {
    try {
        const url = endpoints.PICKS.ADD(param);
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const updatePicks = createAsyncThunk('week/updatePicks', async (param: PickRequest) => {
    try {
        const url = endpoints.PICKS.UPDATE;
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const deletePicks = createAsyncThunk('week/deletePicks', async (param: PickDeleteRequest) => {
    try {
        const url = endpoints.PICKS.DELETE;
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
 });

const weekSlice = createSlice({
    name: 'week',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchWeek.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.games = action.payload.response.games as Game[];
                    state.teams = action.payload.response.teams as Team[];
                    state.picks = action.payload.response.picks as Pick[];
                    state.userPicks = action.payload.response.userPicks as PicksUserData[];
                    state.setWeek = action.payload.week;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchWeek.pending, (state, action) => {
                state.status = status.LOADING
            })
            .addCase(addPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.status = status.COMPLETE;
                } else {
                    let error = action.payload.message.content;
                    state.message = getMessageFromError(error);
                    state.status = status.ERROR;
                }
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.status = status.COMPLETE;
                } else {
                    let error = action.payload.message.content;
                    state.message = getMessageFromError(error);
                    state.status = status.ERROR;
                }
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.status = status.COMPLETE;
                } else {
                    let error = action.payload.message.content;
                    state.message = getMessageFromError(error);
                    state.status = status.ERROR;
                }
            })
    },
});

export const selectGames = (state: RootState) => state.week.games as Game[]

export const selectGamesById = (state: RootState, gameId: number) => state.week.games.find((game: Game) => game.game_id === gameId) as Game;

export const selectGameIds = (state: RootState) => state.week.games.map((game: Game) => game.game_id) as number[];

export const selectGamesPastSubmit = (state: RootState) => state.week.games.find((game: Game) => new Date(game.pick_submit_by_date) < new Date()) as Game;

export const selectTeams = (state: RootState) => state.week.teams as Team[]

export const selectTeamById = (state: RootState, teamId: number) => state.week.teams.find((team: Team) => team.team_id === teamId) as Team;

export const selectPicks = (state: RootState) => state.week.picks;

export const selectPicksCount = (state: RootState) => state.week.picks.length as number;

export const selectGamesByIdNoPicks = (state: RootState) => 
    state.week.games.filter(week => !state.week.picks.map((pick: Pick) => 
        pick.game_id).includes(week.game_id)).map(game => 
            game.game_id) as number[];

export const selectUserPickDataByGame = (state: RootState, gameId: number) => state.week.userPicks.filter(data => data.game_id === gameId) as PicksUserData[];

export const selectPicksMessage = (state: RootState) => state.week.message;

export const getSetWeek = (state: RootState) => state.week.setWeek;

export const showSubmitByGameId = (state: RootState, gameId: number, prevGameId: number | null ) => {
    let currGame = state.week.games.find(game => game.game_id === gameId);
    let submitTime1 = currGame == null ? null : currGame.pick_submit_by_date;
    
    if(submitTime1 != null && prevGameId == null) {
        return (new Date(submitTime1) > new Date()) as boolean;
    } else if(submitTime1 != null && prevGameId != null){
        let submitTime2 = state.week.games.find(game => game.game_id === prevGameId)?.pick_submit_by_date;
        return ((submitTime1 !== submitTime2) && (new Date(submitTime1) > new Date())) as boolean;
    } else {
        return false;
    }
}

export default weekSlice.reducer
