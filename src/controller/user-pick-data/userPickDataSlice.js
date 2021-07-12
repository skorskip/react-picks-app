import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { environment } from '../../configs/environment';
import { status } from '../../configs/status';
import { client } from '../../utils/client';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const picksUrl = environment.picksServiceURL + 'picks';
const userPickDataAdapter = createEntityAdapter();

const initialState = userPickDataAdapter.getInitialState({
    status: status.IDLE,
    userPickData: {}
});

export const fetchUserPickData = createAsyncThunk('userPickData/fetchUserPickData', async (params) => {
    const url = `${picksUrl}/games?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`;
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC})
        return {status: status.ERROR, message: error}
    }
});

const userPickDataSlice = createSlice({
    name: 'userPickData',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserPickData.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchUserPickData.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.userPickData = {};
                    state.status = status.ERROR;
                } else {
                    state.userPickData = action.payload;
                    state.status = status.COMPLETE;
                }
            })
    }
});

export const selectUserPickDataByGame = (state, gameId) => state.userPickData.userPickData[gameId];

export default userPickDataSlice.reducer;
