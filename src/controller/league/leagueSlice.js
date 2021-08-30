import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const leagueAdapter = createEntityAdapter();

const initialState = leagueAdapter.getInitialState({
    status: status.IDLE,
    league: {}
});

export const fetchLeague = createAsyncThunk('league/fetchLeague', async () => {
    try {
        const url = endpoints.LEAGUE.SETTINGS;
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, status.MESSAGE.ERROR_GENERIC);
        return {status: status.ERROR, message: error}
    }
});

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchLeague.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchLeague.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.league = {};
                    state.status = status.ERROR;
                } else {
                    state.league = action.payload;
                    state.status = status.COMPLETE;
                }
            });
    }
});

export const selectLeague = (state) => state.league.league;
export const selectMessageSource = (state) => state.league.league?.messageSource;

export default leagueSlice.reducer