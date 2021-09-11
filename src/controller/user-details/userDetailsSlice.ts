import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { UserDetails } from '../../model/userDetails/userDetails';
import { RootState } from '../../store';
import { client } from '../../utils/client';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const userDetailsAdapter = createEntityAdapter();

const initialState = userDetailsAdapter.getInitialState({
    status: status.IDLE,
    userDetails: {} as UserDetails
});

export const fetchUserDetails = createAsyncThunk('userDetails/fetchUserDetails', async (user_id) => {
    const url = `${endpoints.USERS.DETAILS}?userId=${user_id}`;
    try{
        const response = await client.get(url);
        return response[0];
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error};
    }
});

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.userDetails = action.payload;
                    state.status = status.COMPLETE;
                }
            })
    }
});

export const selectUserDetails = (state: RootState) => state.userDetails.userDetails as UserDetails;

export default userDetailsSlice.reducer;
