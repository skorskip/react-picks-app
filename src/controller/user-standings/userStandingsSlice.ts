import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { UserStanding } from '../../model/userStanding/userStanding';

const userStandingsAdapter = createEntityAdapter();

const initialState = userStandingsAdapter.getInitialState({
    status: status.IDLE,
    userStandings: [] as UserStanding[]
});

export const fetchUserStandings = createAsyncThunk('userStandings/fetchUserStandings', async (params: SeasonRequest) => {
    const url = `${endpoints.USERS.STANDINGS}?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}`;
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error};
    }
})

const userStandingsSlice = createSlice({
    name: 'userStandings',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserStandings.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
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

export const selectUserStandings = (state) => state.userStandings.userStandings as UserStanding[];

export const userStandingById = (state, user_id) => state.userStandings.userStandings.find((standing) => standing.user_id === user_id) as UserStanding;

export default userStandingsSlice.reducer