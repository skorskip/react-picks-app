import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';

const weekUrl = environment.userServiceURL + 'week';

const gamesAdapter = createEntityAdapter();

const intialState = {
    status: 'idle',
    entities: {}
}

export const fetchGames = createAsyncThunk('user/fetchGames',  async (season, seasonType, week, user) => {
    const url = weekUrl + '?season=' + season + '&seasonType=' + seasonType + '&week=' + week;
    const response = await client.post(url, user);
    return response;
})   

const gamesSlice = createSlice({
    name: 'games',
    initialState: gamesAdapter.getInitialState(),
    extraReducers : (builder) => {
        builder
            .addCase(fetchGames.fulfilled, (state, action) => {
                gamesAdapter.setAll(state, action.payload)
            })
    },
});

const gamesSelectors = gamesAdapter.getSelectors((state) => state.games)

export const {
    selectAll: selectGames
} = gamesSelectors

export default gamesSlice.reducer
