import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';
import { RootState } from '../../store';
import { League, MessageSource } from '../../model/league/league';

const leagueAdapter = createEntityAdapter();

const initialState = leagueAdapter.getInitialState({
    status: status.IDLE,
    league: {} as League
});

export const fetchLeague = createAsyncThunk('league/fetchLeague', async () => {
    try {
        const url = endpoints.LEAGUE.SETTINGS;
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchLeague.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchLeague.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.league = action.payload;
                    state.status = status.COMPLETE;
                }
            });
    }
});

export const selectLeague = (state: RootState) => state.league.league as League;
export const selectMessageSource = (state: RootState) => state.league.league.messageSource as MessageSource;

export default leagueSlice.reducer