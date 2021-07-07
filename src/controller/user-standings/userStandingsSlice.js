import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const userStandingsUrl = environment.userServiceURL + 'users/standings';

const userStandingsAdapter = createEntityAdapter();

const initialState = userStandingsAdapter.getInitialState({
    status: status.IDLE,
    userStandings: []
});

export const fetchUserStandings = createAsyncThunk('userStandings/fetchUserStandings', async (params) => {
    const url = `${userStandingsUrl}?season=${params.season}&seasonType=${params.seasonType}`;
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        return {status: status.ERROR, message: error};
    }
})

const userStandingsSlice = createSlice({
    name: 'userStandings',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserStandings.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.userStandings = [];
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
                } else {
                    state.userStandings = action.payload;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchUserStandings.pending, (state, action) => {
                state.status = status.LOADING;
            })
    }
});

export const selectUserStandings = (state) => state.userStandings.userStandings;

export const userStandingById = (state, user_id) => state.userStandings.userStandings.find((standing) => standing.user_id === user_id);

export default userStandingsSlice.reducer