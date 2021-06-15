import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { environment } from '../../configs/environment';
import { client } from '../../utils/client';

const usersUrl = environment.userServiceURL + 'users';
const userPickLimitAdapter = createEntityAdapter();

const initialState = userPickLimitAdapter.getInitialState({
    status: 'idle',
    userPickLimit: {}
});

export const fetchUserPickLimit = createAsyncThunk('userPickData/fetchUserPickLimit', async (params) => {
    const url = `${usersUrl}/userPicksLimit?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&userId=${params.user_id}`;
    const response = await client.get(url);
    localStorage.setItem("userPickLimit", JSON.stringify(response));
    return response[0];
});

const userPickLimitSlice = createSlice({
    name: 'userPickLimit',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserPickLimit.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPickLimit.fulfilled, (state, action) => {
                state.userPickLimit = action.payload;
                state.status = 'complete';
            })
    }
});

export const selectUserPickLimit = (state) => state.userPickLimit.userPickLimit;

export default userPickLimitSlice.reducer;
