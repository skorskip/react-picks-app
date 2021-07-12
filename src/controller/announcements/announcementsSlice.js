import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const announcementsUrl = environment.messageServiceURL + 'message';
const announcementsAdapter = createEntityAdapter();

const initialState = announcementsAdapter.getInitialState({
    status: status.IDLE,
    announcements: {}
});

export const fetchAnnouncements = createAsyncThunk('announcemnets/fetchAnnouncements', async (params) => {
    try {
        const url = announcementsUrl + '/announcements';
        const response = await client.post(url, params);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, status.MESSAGE.ERROR_GENERIC);
        return {status: status.ERROR, message: error}
    }
});

const announcementsSlice = createSlice({
    name: 'announcements',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.announcements = {messages:[]};
                    state.status = status.ERROR;
                } else {
                    state.announcements = action.payload;
                    state.status = status.COMPLETE;
                }
            });
    }
});

export const selectAnnouncements = (state) => state.announcements.announcements;

export default announcementsSlice.reducer;