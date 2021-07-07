import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { status } from '../../configs/status';

const weekUrl = environment.weekServiceURL + 'week';

const gamesAdapter = createEntityAdapter();

const initialState = gamesAdapter.getInitialState({
    status: status.IDLE,
    games: [],
    teams: []
});

export const fetchGames = createAsyncThunk('user/fetchGames',  async (param) => {
    const url = `${weekUrl}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`
    const response = await client.post(url, param.user);
    return response;
})

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.games = action.payload.games;
                state.teams = action.payload.teams;
                state.status = status.COMPLETE
            })
            .addCase(fetchGames.pending, (state, action) => {
                state.status = status.LOADING
            })
    },
});

export const selectGames = (state) => state.games.games

export const selectGamesById = (state, gameId) => state.games.games.find((game) => game.game_id === gameId);

export const selectGameIds = (state) => state.games.games.map((game) => game.game_id);

export const selectGamesPastSubmit = (state) => state.games.games.find((game) => game.pick_submit_by_date < new Date());

export const selectTeams = (state) => state.games.teams

export const selectTeamById = (state, teamId) => state.games.teams.find((team) => team.team_id === teamId); 

export default gamesSlice.reducer
