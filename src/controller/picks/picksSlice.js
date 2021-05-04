import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { useParams } from 'react-router';

const pickUrl = environment.picksServiceURL + 'picks';

const picksAdapter = createEntityAdapter();

const pickResponse = {
    success: "SUCCESS",
    error: "ERROR"
}

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

    if(response.message === pickResponse.success) {
        var updated = [];
        param.picks.forEach((newPick, index) => {
            newPick.pick_id = parseInt(response.result) + index;
            updated.push(newPick);
        });
        return updated;
    } else {
        return pickResponse.error;
    }
});

export const updatePicks = createAsyncThunk('picks/updatePicks', async (param) => {
    let failed = false;
    for(const pick of param.picks) {
        const url = pickUrl + '/' + pick.pick_id;
        const response = await client.put(url, pick);
        if(response.message !== pickResponse.success) {
            failed = true;
            break;
        }
    }

    if(!failed){
        return param.picks;
    } else {
        return pickResponse.error;
    }
});

export const deletePicks = createAsyncThunk('picks/deletePicks', async (param) => {
    let failed = false
    for(const pick_id of param.picks){
        const url = pickUrl + '/' + pick_id;
        const response = await client.delete(url);
        if(response.message !== pickResponse.success) {
            failed = true 
            break;
        }
    };

    if(!failed) {
        return param.picks;
    } else {
        return pickResponse.error;
    }
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
                if(action.payload !== pickResponse.error) {
                    state.picks = state.picks.concat(action.payload);
                    localStorage.setItem("picks", JSON.stringify(state.picks));
                }
                state.status = 'complete';
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                if(action.payload !== pickResponse.error) {
                    for(const pick of action.payload){
                        for(var i = 0; i < state.picks.length; i++) {
                            if(state.picks[i].pick_id === pick.pick_id) {
                                state.picks[i] = pick;
                                break;
                            }
                        }
                    }
                }
                state.status = 'complete';
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                if(action.payload !== pickResponse.error) {
                    const filtered = state.picks.filter(pick => !action.payload.includes(pick.pick_id));
                    state.picks = filtered;
                }
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
