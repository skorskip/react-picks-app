import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';

const announcementsUrl = environment.messageServiceURL + 'message';
const announcementsAdapter = createEntityAdapter();

const initialState = announcementsAdapter.getInitialState({
    status: 'idle',
    announcements: {}
});

export const fetchAnnouncements = createAsyncThunk('announcemnets/fetchAnnouncements', async (params) => {
    const url = announcementsUrl + '/announcements';
    const response = await client.post(url, params);
    localStorage.setItem("announcements", JSON.stringify(response));
    return response;
});

const announcementsSlice = createSlice({
    name: 'announcements',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.announcements = action.payload;
                state.status = 'complete';
            });
    }
});

export const selectAnnouncements = (state) => state.announcements.announcements;

export default announcementsSlice.reducer;