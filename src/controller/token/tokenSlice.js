import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { status } from '../../configs/status';
import AmplifyAuth from '../../utils/amplifyAuth';

const tokenAdapter = createEntityAdapter();

const initialState = tokenAdapter.getInitialState({
    status: status.IDLE,
    token: null
});

export const fetchToken = createAsyncThunk('token/fetchToken', async () => {
    return AmplifyAuth.FetchCurrentSession();
});

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchToken.fulfilled, (state, action) => {
                if(action.payload !== null) {
                    state.token = action.payload
                    state.status = status.COMPLETE;
                } else {
                    state.status = status.IDLE;
                }
                
            })
            .addCase(fetchToken.pending, (state, action) => {
                state.status = status.LOADING;
            })
    }
});

export const selectToken = (state) => state.token.token;

export default tokenSlice.reducer