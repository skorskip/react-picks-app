import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { environment } from '../../configs/environment';
import { client } from '../../utils/client';

const picksUrl = environment.picksServiceURL + 'picks';
const userPickDataAdapter = createEntityAdapter();

const initialState = userPickDataAdapter.getInitialState({
    status: 'idle',
    userPickData: {}
});

export const fetchUserPickData = createAsyncThunk('userPickData/fetchUserPickData', async (params) => {
    const url = `${picksUrl}/games?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`;
    const response = await client.get(url);
    localStorage.setItem("userPicksData", JSON.stringify(response));
    return response;
});

const userPickDataSlice = createSlice({
    name: 'userPickData',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserPickData.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPickData.fulfilled, (state, action) => {
                state.userPickData = action.payload;
                state.status = 'complete';
            })
    }
});

export const selectUserPickDataByGame = (state, gameId) => state.userPickData.userPickData[gameId];

export default userPickDataSlice.reducer;
