import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { RootState } from '../../store';
import { User } from '../../model/user/user';
import { publish, PubSub } from '../pubSub/pubSubSlice';
import { SnackMessage } from '../../components/message/messagePopup';
import { SHOW_MESSAGE } from '../../configs/topics';

const userStandingsAdapter = createEntityAdapter();

const initialState = userStandingsAdapter.getInitialState({
    status: status.IDLE,
    userStandings: [] as User[]
});

export const fetchUserStandings = createAsyncThunk('userStandings/fetchUserStandings', async (params: SeasonRequest, {dispatch}) => {
    const url = endpoints.USERS.STANDINGS(params);
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
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

export const selectUserStandings = (state: RootState) => 
    state.userStandings.userStandings
    .filter(standing => standing.current_season_data != null)
    .sort((user1, user2) => {
        if(user1.current_season_data.ranking < user2.current_season_data.ranking) {
            return -1
        } else {
            return 1
        }
    }) as User[];

export const userStandingById = (state: RootState, user_id: number | null) => state.userStandings.userStandings.find((standing) => standing.user_id === user_id) as User;
export const userStandingByIds = (state: RootState, user_ids: Array<number>) => 
    state.userStandings.userStandings.filter((standing) => 
    (user_ids.includes(standing.user_id))) as Array<User>;
export const userStandingByCurrent = (state: RootState, currentUser: User) => state.userStandings.userStandings.filter((standing, i) => {
    return (standing?.current_season_data?.ranking + 1) === currentUser.current_season_data?.ranking
        || (standing?.current_season_data?.ranking - 1) === currentUser.current_season_data?.ranking
        || (standing?.current_season_data?.ranking) === currentUser.current_season_data?.ranking
        || standing.user_id === currentUser.user_id
}) as Array<User>;


export default userStandingsSlice.reducer