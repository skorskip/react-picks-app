import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';

const pickUrl = environment.picksServiceURL + 'picks';

const picksAdapter = createEntityAdapter();

const initialState = picksAdapter.getInitialState({
    status: 'idle',
    picks: [],
    teams: [],
    games: []
});

export const fetchPicks = createAsyncThunk('user/fetchPicks',  async (param) => {
    const url = pickUrl + '/week?season=' + param.season + '&seasonType=' + param.seasonType + '&week=' + param.week;
    const response = await client.post(url, param.user);
    localStorage.setItem("picks", JSON.stringify(response.picks));
    return response;
})

const picksSlice = createSlice({
    name: 'picks',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicks.fulfilled, (state, action) => {
                state.picks = state.picks.concat(action.payload.picks)
                state.games = state.games.concat(action.payload.games)
                state.teams = state.teams.concat(action.payload.teams)
                state.status = 'idle'
            })
            .addCase(fetchPicks.pending, (state, action) => {
                state.status = 'loading'
            })
    },
});

export const selectPicks = (state) => state.picks.picks;

export const selectPicksById = (state, pickId) => state.picks.picks.find((pick) => pick.pick_id === pickId);

export const selectPicksIds = (state) => state.picks.picks.map((pick) => pick.pick_id);

export const selectPicksGameById = (state, gameId) => state.picks.games.find((game) => game.game_id === gameId);

export const selectPicksTeamById = (state, teamId) => state.picks.teams.find((team) => team.team_id === teamId); 


export default picksSlice.reducer
