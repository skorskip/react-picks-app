import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { User } from '../../model/user/user';
import AmplifyAuth from '../../utils/amplifyAuth';

const usersUrl = environment.userServiceURL + 'users';

const userAdapter = createEntityAdapter();

const usersResponse = {
    error: "ERROR",
    success: "SUCCESS"
}

const initialState = userAdapter.getInitialState({
    status: localStorage.getItem("user") === null ? 'idle' :'complete',
    user: localStorage.getItem("user") === null ? {} : JSON.parse(localStorage.getItem("user"))
});

export const login = (username, password) => {
    return AmplifyAuth.AmplifyLogin(username, password);
};

export const forgotPassword = (username) => {
    return AmplifyAuth.SendForgotPasswordCode(username);
}

export const resetPassword = (username, password, code) => {
    return AmplifyAuth.ForgotPassword(username, password, code);
}

export const createPassword = (username, tempPassword, newPassword) => {
    return AmplifyAuth.CompletePasswordLogin(username, tempPassword, newPassword);
}

export const signOut = createAsyncThunk('user/signOut', async () => {
    localStorage.clear();
    return AmplifyAuth.SignOut();
})

export const fetchUser = createAsyncThunk('user/fetchUser',  async (username, password, token) => {
    const url = usersUrl + '/login';
    try {
        const newUser = new User(0, username, password, '', '', '', '', '', '', '');
        const response = await client.post(url, newUser, {Authorization: token});
        localStorage.setItem("user", JSON.stringify(response[0]));
        return response[0];
    } catch(error) {
        return usersResponse.error;
    }
})   

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                if(action.payload === usersResponse.error) {
                    state.user = {};
                } else {
                    state.user = action.payload;
                }
                state.user = action.payload;
                state.status = 'complete';
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(signOut.fulfilled, (state, action) => {
                state.user = {}
                state.status = 'idle'
            })
    },
});

export const { usersLoaded } = userSlice.actions

export const selectUser = (state) => state.user.user;

export default userSlice.reducer

