import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { client } from '../../utils/client';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const userPickLimitAdapter = createEntityAdapter();

const initialState = userPickLimitAdapter.getInitialState({
    status: status.IDLE,
    userPickLimit: {}
});

export const fetchUserPickLimit = createAsyncThunk('userPickData/fetchUserPickLimit', async (params) => {
    const url = `${endpoints.USERS.PICK_LIMIT}?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&userId=${params.user_id}`;
    try{
        const response = await client.get(url);
        return response[0];
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error};
    }
});

const userPickLimitSlice = createSlice({
    name: 'userPickLimit',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserPickLimit.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchUserPickLimit.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.userPickLimit = {};
                    state.status = status.ERROR;
                } else {
                    state.userPickLimit = action.payload;
                    state.status = status.COMPLETE;
                }
            })
    }
});

export const selectUserPickLimit = (state) => state.userPickLimit.userPickLimit;

export default userPickLimitSlice.reducer;
