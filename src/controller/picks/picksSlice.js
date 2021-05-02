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

export const fetchPicks = createAsyncThunk('picks/fetchPicks',  async (param) => {
    const url = pickUrl + '/week?season=' + param.season + '&seasonType=' + param.seasonType + '&week=' + param.week;
    const response = await client.post(url, param.user);
    localStorage.setItem("picks", JSON.stringify(response.picks));
    return response;
});

export const addPicks = createAsyncThunk('picks/addPicks', async (param) => {
    const url = pickUrl + '/create';
    const response = await client.post(url, param.picks);
    return param.picks;
});

export const updatePicks = createAsyncThunk('picks/updatePicks', async (pick) => {
    const url = pickUrl + '/' + pick.pick_id;
    const response = await client.post(url, pick);
    return pick;
});

export const deletePicks = createAsyncThunk('picks/deletePicks', async (pick_id) => {
    console.log("DELETE", pick_id);
    const url = pickUrl + '/' + pick_id;
    const response = await client.delete(url);
    return pick_id;
 });

const picksSlice = createSlice({
    name: 'picks',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicks.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPicks.fulfilled, (state, action) => {
                state.picks = state.picks.concat(action.payload.picks)
                state.games = state.games.concat(action.payload.games)
                state.teams = state.teams.concat(action.payload.teams)
                state.status = 'idle'
            })
            .addCase(addPicks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                action.payload.forEach((pick) => {
                    state.picks = state.picks.concat(pick);
                });
                localStorage.setItem("picks", JSON.stringify(state.picks));
                state.status = 'complete';
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                state.picks.forEach((pick, index) => {
                    if(pick.pick_id === action.payload.pick_id) {
                        state.picks[index] = action.payload;
                    }
                })
                state.status = 'complete';
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                state.picks.forEach((pick, index) => {
                    if(pick.pick_id === action.payload) {
                        state.picks.splice(index, 1);
                    }
                });
                state.status = 'complete';
            })
    },
});

export const selectPicks = (state) => state.picks.picks;

export const selectPicksById = (state, pickId) => state.picks.picks.find((pick) => pick.pick_id === pickId);

export const selectPicksIds = (state) => state.picks.picks.map((pick) => pick.pick_id);

export const selectPicksGamesIds = (state) => state.picks.picks.map((pick) => pick.game_id);

export const selectPicksGameById = (state, gameId) => state.picks.games.find((game) => game.game_id === gameId);

export const selectPicksTeamById = (state, teamId) => state.picks.teams.find((team) => team.team_id === teamId); 


export default picksSlice.reducer
