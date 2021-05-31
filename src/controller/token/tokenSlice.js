import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';

const tokenAdapter = createEntityAdapter();

const initialState = tokenAdapter.getInitialState({
    status: 'idle',
    token: {}
});

export const fetchToken = createAsyncThunk('token/fetchToken', async () => {
    try {
        const response = await Auth.currentSession();
        var expiration = new Date(response.getIdToken().getExpiration() * 1000);
        if(new Date() > expiration) {
            return null;
        } else {
            localStorage.setItem("token", response.getIdToken().getJwtToken());
            return response.getIdToken().getJwtToken();
        }
    } catch(error) {
        return null;
    }
})

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchToken.fulfilled, (state, action) => {
                state.token = action.payload
                state.status = 'complete'
            })
            .addCase(fetchToken.pending, (state, action) => {
                state.status = 'loading'
            })
    }
});

export const selectToken = (state) => state.token.token;

export default tokenSlice.reducer