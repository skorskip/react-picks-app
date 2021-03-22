import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { setTeamsSlice } from '../teams/teamsSlice';
import { useDispatch } from 'react-redux';

const weekUrl = environment.userServiceURL + 'week';

const gamesAdapter = createEntityAdapter();

const initialState = {
    status: 'idle',
    entities: {}
}

export const fetchGames = createAsyncThunk('user/fetchGames',  async (season, seasonType, week, user) => {
    const url = weekUrl + '?season=' + season + '&seasonType=' + seasonType + '&week=' + week;
    const response = await client.post(url, user);
    useDispatch(setTeamsSlice(response.teams));
    return response;
})

const gamesSlice = createSlice({
    name: 'games',
    initialState: initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = 'idle'
                gamesAdapter.setAll(state, action.payload)
            })
            .addCase(fetchGames.pending, (state, action) => {
                state.status = 'loading'
            })
    },
});

const gamesSelectors = gamesAdapter.getSelectors((state) => state.games)

export const {
    selectAll: selectGames,
    selectById: selectGamesById
} = gamesSelectors

export default gamesSlice.reducer
