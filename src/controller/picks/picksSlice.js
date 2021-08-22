import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const picksAdapter = createEntityAdapter();

const initialState = picksAdapter.getInitialState({
    status: status.IDLE,
    message: null,
    weekSet: "",
    picks: []
});

export const fetchPicks = createAsyncThunk('picks/fetchPicks',  async (param) => {
    try {
        const url = `${endpoints.PICKS.BY_WEEK}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`;
        const response = await client.post(url, param.user);
        return {week: param.week, response: response};
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error}
    }
});


export const fetchUsersPicks = createAsyncThunk('picks/fetchUsersPicks',  async (param) => {
    try {
        const url = `${endpoints.PICKS.OTHERS_BY_WEEK}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}&user=${param.user}`;
        const response = await client.get(url);
        return {week: param.week, response: response};
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error}
    }
});

export const addPicks = createAsyncThunk('picks/addPicks', async (param) => {
    try {
        const url = endpoints.PICKS.ADD + param.userId;
        const response = await client.post(url, param.picks);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.ADD_SUCCESS});
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error}
    }
});

export const updatePicks = createAsyncThunk('picks/updatePicks', async (param) => {
    try {
        const url = endpoints.PICKS.UPDATE + param.userId;
        const response = await client.post(url, param.picks);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.EDIT_SUCCESS});
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error}
    }
});

export const deletePicks = createAsyncThunk('picks/deletePicks', async (param) => {
    try {
        const url = endpoints.PICKS.DELETE + param.userId;
        const response = await client.post(url, param.picks);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.EDIT_SUCCESS});
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
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
                    state.picks = [];
                    state.status = status.ERROR;
                } else {
                    state.picks = action.payload.response.picks;
                    state.weekSet = 0;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchPicks.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.picks = [];
                    state.status = status.ERROR;
                } else {
                    state.picks = action.payload.response.picks;
                    state.weekSet = action.payload.week;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(addPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload.picks;
                    state.status = status.COMPLETE;
                } else {
                    state.picks = [];
                    state.message = action.payload.message;
                    state.status = status.ERROR;
                }
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload.picks;
                    state.status = status.COMPLETE;
                } else {
                    state.picks = [];
                    state.message = action.payload.message;
                    state.status = status.ERROR;
                }
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = action.payload.picks;
                    state.status = status.COMPLETE;
                } else {
                    state.picks = [];
                    state.message = action.payload.message;
                    state.status = status.ERROR;
                }
            })
    },
});

export const selectPicks = (state) => state.picks.picks;

export const selectPicksMessage = (state) => state.picks.message;

export const getPicksSetWeek = (state) => state.picks.weekSet;

export const selectPicksById = (state, pickId) => state.picks.picks.find((pick) => pick.pick_id === pickId);

export const selectPicksIds = (state) => state.picks.picks.map((pick) => pick.pick_id);

export const selectPicksGamesIds = (state) => state.picks.picks.map((pick) => pick.game_id);

export default picksSlice.reducer
