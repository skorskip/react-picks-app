import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { client } from '../../utils/client';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { PicksUserData } from '../../model/picksUserData/picksUserData';

const userPickDataAdapter = createEntityAdapter();

const initialState = userPickDataAdapter.getInitialState({
    status: status.IDLE,
    userPickData: [] as PicksUserData[]
});

export const fetchUserPickData = createAsyncThunk('userPickData/fetchUserPickData', async (params: SeasonRequest) => {
    const url = `${endpoints.PICKS.ALL_PICKS_BY_WEEK}?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`;
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
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserPickData.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchUserPickData.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.userPickData = action.payload;
                    state.status = status.COMPLETE;
                }
            })
    }
});

export const selectUserPickDataByGame = (state, gameId) => state.userPickData.userPickData.filter(data => data.game_id === gameId) as PicksUserData[];

export default userPickDataSlice.reducer;
