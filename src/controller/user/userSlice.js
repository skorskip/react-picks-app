import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { User } from '../../model/user/user';
import AmplifyAuth from '../../utils/amplifyAuth';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const usersUrl = environment.userServiceURL + 'users';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: localStorage.getItem("user") === null ? status.IDLE : status.COMPLETE,
    user: localStorage.getItem("user") === null ? {} : JSON.parse(localStorage.getItem("user"))
});

export const login = (username, password) => {
    try {
        return AmplifyAuth.AmplifyLogin(username, password);
    } catch(error) {
        console.error(error)
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.USER.LOGIN_ERROR});
    }
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
        return {status: status.ERROR, message: error}
    }
})   

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.user = {}
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type:status.ERROR, message:status.MESSAGE.USER.LOGIN_ERROR});
                } else {
                    state.user = action.payload;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(signOut.fulfilled, (state, action) => {
                state.user = {}
                state.status = status.IDLE;
            })
    },
});

export const { usersLoaded } = userSlice.actions

export const selectUser = (state) => state.user.user;

export default userSlice.reducer

