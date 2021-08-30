import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const gamesAdapter = createEntityAdapter();

const initialState = gamesAdapter.getInitialState({
    status: status.IDLE,
    games: [],
    teams: []
});

export const fetchGames = createAsyncThunk('user/fetchGames',  async (param) => {
    try {
        const url = `${endpoints.GAMES.BASE}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`
        const response = await client.post(url, param.user);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, status.MESSAGE.ERROR_GENERIC);
        return {status: status.ERROR, message: error}
    }
})

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchGames.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.games = [];
                    state.teams = [];
                    state.status = status.ERROR;
                } else {
                    state.games = action.payload.games;
                    state.teams = action.payload.teams;
                    state.status = status.COMPLETE;
                }
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
