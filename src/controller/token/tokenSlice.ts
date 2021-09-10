import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { status } from '../../configs/status';
import AmplifyAuth from '../../utils/amplifyAuth';

const tokenAdapter = createEntityAdapter();

const initialState = tokenAdapter.getInitialState({
    status: status.IDLE,
    token:  null
});

export const fetchToken = createAsyncThunk('token/fetchToken', async () => {
    try {
        return AmplifyAuth.FetchCurrentSession();
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error, response: null}
    }
});

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchToken.fulfilled, (state, action) => {
                if(action.payload.status !== status.ERROR) {
                    state.token = action.payload.response;
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