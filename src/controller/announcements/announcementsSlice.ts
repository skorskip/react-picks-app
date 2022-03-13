import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { DateRequest } from '../../model/postRequests/dateRequest';
import { RootState } from '../../store';
import { Announcement, Message } from '../../model/announcement/announcement';
import { ReminderRequest } from '../../model/postRequests/reminderRequest';

const announcementsAdapter = createEntityAdapter();

const initialState = announcementsAdapter.getInitialState({
    status: status.IDLE,
    announcements: new Announcement(0, "", [] as Message[]),
    reminderStatus: status.IDLE
});

export const fetchAnnouncements = createAsyncThunk('announcemnets/fetchAnnouncements', async (params: DateRequest) => {
    try {
        const url = endpoints.MESSAGES.ANNOUNCEMENTS;
        const response = await client.post(url, params);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

export const fetchSetReminder = createAsyncThunk('announcements/fetchSetReminder', async (params: ReminderRequest) => {
    try {
        const url = endpoints.MESSAGES.SET_REMINDER;
        const response = await client.post(url, params);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
});

const announcementsSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.status = status.ERROR;
                } else {
                    state.announcements = action.payload;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchSetReminder.pending, (state, action) => {
                state.reminderStatus = status.LOADING;
            })
            .addCase(fetchSetReminder.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.reminderStatus = status.ERROR;
                } else {
                    state.reminderStatus = status.COMPLETE;
                }
            })
    }
});

export const selectAnnouncements = (state: RootState) => state.announcements.announcements as Announcement;

export default announcementsSlice.reducer;