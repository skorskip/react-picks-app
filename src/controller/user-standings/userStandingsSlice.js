import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';
import { UserStanding } from '../../model/userStanding/userStanding';

const userStandingsUrl = environment.userServiceURL + 'users/standings';

const userStandingsAdapter = createEntityAdapter();

const initialState = userStandingsAdapter.getInitialState({
    status: 'idle',
    userStandings: []
});

export const fetchUserStandings = createAsyncThunk('userStandings/fetchUserStandings', async (params) => {
    const url = `${userStandingsUrl}?season=${params.season}&seasonType=${params.seasonType}`;
    const response = await client.get(url);
    return response;
})

const userStandingsSlice = createSlice({
    name: 'userStandings',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserStandings.fulfilled, (state, action) => {
                state.userStandings = action.payload
                state.status = 'complete'
            })
            .addCase(fetchUserStandings.pending, (state, action) => {
                state.status = 'loading'
            })
    }
});

export const selectUserStandings = (state) => state.userStandings.userStandings;

export default userStandingsSlice.reducer