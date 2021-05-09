import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';

const leagueUrl = environment.leagueServiceURL + 'league';
const leagueAdapter = createEntityAdapter();

const initialState = leagueAdapter.getInitialState({
    status: localStorage.getItem("settings") === null ? 'idle' : 'complete',
    league: localStorage.getItem("settings") === null ? {} : localStorage.getItem("settings")
});

export const fetchLeague = createAsyncThunk('league/fetchLeague', async () => {
    const url = leagueUrl + '/settings';
    const response = await client.get(url);
    localStorage.setItem("league", JSON.stringify(response));
    return response;
});

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchLeague.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchLeague.fulfilled, (state, action) => {
                state.league = action.payload;
                state.status = 'complete';
            });
    }
});

export const selectLeague = (state) => state.league.league;
export const selectMessageSource = (state) => state.league.league?.messageSource;

export default leagueSlice.reducer