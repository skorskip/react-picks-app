import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { Pick, PickSubmitEnum } from '../../model/pick/pick';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { PickDeleteRequest } from '../../model/postRequests/pickDeleteRequest';
import { RootState } from '../../store';

const picksAdapter = createEntityAdapter();

const initialState = picksAdapter.getInitialState({
    status: status.IDLE,
    message: "" as string | null,
    weekSet: undefined as number | undefined,
    picks: [] as Pick[]
});

const getMessageFromError = (error: any) => {
    switch (error.message) {
        case PickSubmitEnum.PASS_SUBMIT_DATE :
            return status.MESSAGE.PICKS.PASS_SUBMIT_DATE;
        case PickSubmitEnum.TOO_MANY_PICKS :
            let message = status.MESSAGE.PICKS.TOO_MANY_PICKS;
            message = message.replace('$OVER', error.content.data.over)
                .replace('$LIMIT', error.content.data.limit);
            return message;
        case PickSubmitEnum.NO_PICKS : 
            return status.MESSAGE.PICKS.NO_PICKS;
        default :
            return null;
    }
}

export const fetchPicks = createAsyncThunk('picks/fetchPicks',  async (param: SeasonRequest) => {
    try {
        const url = `${endpoints.PICKS.BY_WEEK}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`;
        const response = await client.get(url);
        return {week: param.week, response: response};
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const fetchUsersPicks = createAsyncThunk('picks/fetchUsersPicks',  async (param: PickRequest) => {
    try {
        const url = `${endpoints.PICKS.OTHERS_BY_WEEK}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}&user=${param.user_id}`;
        const response = await client.get(url);
        return {week: param.week, response: response};
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const addPicks = createAsyncThunk('picks/addPicks', async (param: PickRequest) => {
    try {
        const url = endpoints.PICKS.ADD + param.user_id;
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const updatePicks = createAsyncThunk('picks/updatePicks', async (param: PickRequest) => {
    try {
        const url = endpoints.PICKS.UPDATE;
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const deletePicks = createAsyncThunk('picks/deletePicks', async (param: PickDeleteRequest) => {
    try {
        const url = endpoints.PICKS.DELETE;
        const response = await client.post(url, param.picks);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
 });

const picksSlice = createSlice({
    name: 'picks',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUsersPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchUsersPicks.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.picks = action.payload.response.picks as Pick[];
                    state.weekSet = 0;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchPicks.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.picks = action.payload.response.picks as Pick[];
                    state.weekSet = action.payload.week;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(addPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload.picks as Pick[];
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
                    state.picks = action.payload.picks as Pick[];
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
                    state.picks = action.payload.picks as Pick[];
                    state.status = status.COMPLETE;
                } else {
                    let error = action.payload.message.content;
                    state.message = getMessageFromError(error);
                    state.status = status.ERROR;
                }
            })
    },
});

export const selectPicks = (state: RootState) => state.picks.picks as Pick[];

export const selectPicksMessage = (state: RootState) => state.picks.message;

export const getPicksSetWeek = (state: RootState) => state.picks.weekSet;

export const selectPicksById = (state: RootState, pickId: number) => state.picks.picks.find((pick: Pick) => pick.pick_id === pickId) as Pick;

export const selectPicksIds = (state: RootState) => state.picks.picks.map((pick: Pick) => pick.pick_id) as number[];

export const selectPicksGamesIds = (state: RootState) => state.picks.picks.map((pick: Pick) => pick.game_id) as number[];

export default picksSlice.reducer
