import {  createSlice, createEntityAdapter, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { Game, GameStatusEnum } from '../../model/week/game';
import { Team } from '../../model/week/team';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { RootState } from '../../store';
import { Pick, PickSubmitEnum } from '../../model/week/pick';
import { PicksUserData } from '../../model/week/picksUserData';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { publish, PubSub } from '../pubSub/pubSubSlice';
import { SnackMessage } from '../../components/message/messagePopup';
import { SHOW_MESSAGE } from '../../configs/topics';

const getMessageFromError = (error: any) => {
    let message = error?.message;
    switch (message) {
        case PickSubmitEnum.PASS_SUBMIT_DATE :
            return status.MESSAGE.PICKS.PASS_SUBMIT_DATE;
        case PickSubmitEnum.TOO_MANY_PICKS :
            let message = status.MESSAGE.PICKS.TOO_MANY_PICKS(error.data.over, error.data.limit);
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
const genericError = new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC);

const initialState = weekAdapter.getInitialState({
    status: status.IDLE,
    picksStatus: status.IDLE,
    setWeek: null as number | null,
    message: "" as string | null,
    games: [] as Game[],
    teams: [] as Team[],
    picks: [] as Pick[],
    userPicks: [] as PicksUserData[]
});

export const fetchWeek = createAsyncThunk('week/fetchGames',  async (param: SeasonRequest, {dispatch}) => {
    try {
        const url = endpoints.GAMES.WEEK(param);
        const response = await client.get(url);
        return { response: response, week: param.week };
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, genericError);
        dispatch(publish(request));
        return {status: status.ERROR, message: error, week: null}
    }
});

export const addPicks = createAsyncThunk('week/addPicks', async (param: PickRequest, {dispatch}) => {
    try {
        const url = endpoints.PICKS.ADD(param);
        const response = await client.post(url, param.picks);

        let message = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.ADD_SUCCESS));
        dispatch(publish(message));

        return response;
    } catch(error) {
        console.error(error);

        let message = getMessageFromError(error);
        
        if(message) {
            dispatch(resetWeekStatus());
            alert(message);
        } else {
            let request = new PubSub(SHOW_MESSAGE, genericError);
            dispatch(publish(request));
        }

        return {status: status.ERROR, message: error};
    }
});

export const updatePicks = createAsyncThunk('week/updatePicks', async (param: PickRequest, {dispatch}) => {
    try {
        const url = endpoints.PICKS.UPDATE;
        const response = await client.post(url, param.picks);

        let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.EDIT_SUCCESS));
        dispatch(publish(request)); 

        return response;
    } catch(error) {
        console.error(error);

        let message = getMessageFromError(error);
        
        if(message) {
            dispatch(resetWeekStatus());
            alert(message);
        } else {
            let request = new PubSub(SHOW_MESSAGE, genericError);
            dispatch(publish(request));
        }

        return {status: status.ERROR, message: error}
    }
});

export const deletePicks = createAsyncThunk('week/deletePicks', async (param: PickRequest, {dispatch}) => {
    try {
        const url = endpoints.PICKS.DELETE;
        const response = await client.post(url, param.picks);

        let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.EDIT_SUCCESS));
        dispatch(publish(request)); 

        return response;
    } catch(error) {
        console.error(error);

        let message = getMessageFromError(error);
        
        if(message) {
            dispatch(resetWeekStatus());
            alert(message);
        } else {
            let request = new PubSub(SHOW_MESSAGE, genericError);
            dispatch(publish(request));
        }

        return {status: status.ERROR, message: error}
    }
 });

 export const deleteWeek = createAsyncThunk('week/deleteWeek',  async (param: PickRequest, {dispatch}) => {
    try {
        const url = endpoints.PICKS.DELETE_WEEK(param);
        await client.delete(url, {});
        return { status: status.COMPLETE };
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, genericError);
        dispatch(publish(request));
        return {status: status.ERROR, message: error}
    }
});

 export const resetWeekStatus = createAction('week/resetStatus', function prepare() {
    return {} as any
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
                state.picksStatus = status.LOADING;
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.picksStatus = status.COMPLETE;
                } else {
                    state.picksStatus = status.ERROR;
                }
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.picksStatus = status.LOADING;
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.picksStatus = status.COMPLETE;
                } else {
                    state.picksStatus = status.ERROR;
                }
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.picksStatus = status.LOADING;
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload as Pick[];
                    state.picksStatus = status.COMPLETE;
                } else {
                    state.picksStatus = status.ERROR;
                }
            })
            .addCase(resetWeekStatus, (state, action) => {
                state.status = status.COMPLETE;
            })
            .addCase(deleteWeek.pending, (state, action) => {
                state.picksStatus = status.LOADING;
            })
            .addCase(deleteWeek.fulfilled, (state, action) => {
                if(action.payload.status !== status.ERROR) {
                    state.picks = [];
                    state.picksStatus = status.COMPLETE;
                } else {
                    state.picksStatus = status.ERROR;
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

export const selectGamesNoPicks = (state: RootState) => 
    state.week.games.filter(week => !state.week.picks.map((pick: Pick) => 
        pick.game_id).includes(week.game_id)) as Game[];

export const selectGamesPicks = (state: RootState) => 
    state.week.games.filter(week => state.week.picks.map((pick: Pick) => 
        pick.game_id).includes(week.game_id)) as Game[];

export const selectUserPickData = (state: RootState) => state.week.userPicks as PicksUserData[];

export const selectUserPickDataByGame = (state: RootState, gameId: number) => state.week.userPicks.filter(data => data.game_id === gameId) as PicksUserData[];

export const selectPicksMessage = (state: RootState) => state.week.message;

export const getSetWeek = (state: RootState) => state.week.setWeek;

export const selectGamesNotComplete = (state: RootState) => state.week.games.filter(game => game.game_status !== GameStatusEnum.completed);

export const selectIsAllGamesCompleted = (state: RootState) => (state.week.games.filter(game => game.game_status === GameStatusEnum.unplayed || game.game_status === GameStatusEnum.live ).length === 0);

export default weekSlice.reducer
