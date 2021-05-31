import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';

const picksForUserUrl = environment.userServiceURL + 'users/others';

const picksForUserAdapter = createEntityAdapter();

const initialState = picksForUserAdapter.getInitialState({
    status: 'idle',
    picksForUser: {}
});

export const fetchPicksForUser = createAsyncThunk('picksForUser/fetchPicksForUser', async (params) => {
    const url = `${picksForUserUrl}?season=${params.season}&seasonType=${params.seasonType}`;
    const response = await client.get(url);
    return response;
})

const picksForUserSlice = createSlice({
    name: 'picksForUser',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicksForUser.fulfilled, (state, action) => {
                state.picksForUser = action.payload
                state.status = 'complete'
            })
            .addCase(fetchPicksForUser.pending, (state, action) => {
                state.status = 'loading'
            })
    }
});

export const selectPicksForUser = (state) => state.picksForUser.picksForUser;

export default picksForUserSlice.reducer