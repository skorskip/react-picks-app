import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { PicksUser } from '../../model/picksUser/picksUser';
import { RootState } from '../../store';
import { publish, PubSub } from '../pubSub/pubSubSlice';
import { SHOW_MESSAGE } from '../../configs/topics';
import { SnackMessage } from '../../components/message/messagePopup';

const picksForUserAdapter = createEntityAdapter();

const initialState = picksForUserAdapter.getInitialState({
    status: status.IDLE,
    picksForUser: [] as PicksUser[]
});

export const fetchPicksForUser = createAsyncThunk('picksForUser/fetchPicksForUser', async (params: PickRequest, {dispatch}) => {
    const url = endpoints.PICKS.OTHERS_BY_WEEK(params);
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
        return {status: status.ERROR, message: error}
    }
})

const picksForUserSlice = createSlice({
    name: 'picksForUser',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicksForUser.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.picksForUser = [] as PicksUser[];
                    state.status = status.ERROR;
                } else {
                    state.picksForUser = action.payload;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchPicksForUser.pending, (state, action) => {
                state.status = status.LOADING;
            })
    }
});

export const selectPicksForUser = (state: RootState) => state.picksForUser.picksForUser as PicksUser[];

export default picksForUserSlice.reducer