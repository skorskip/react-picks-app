import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { User } from '../../model/user/user';
import AmplifyAuth, { AmplifyEnum } from '../../utils/amplifyAuth';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: localStorage.getItem("user") === null ? status.IDLE : status.COMPLETE,
    user: localStorage.getItem("user") === null ? {} : JSON.parse(localStorage.getItem("user"))
});

export const login = async (username, password) => {
    try {
        let response = await AmplifyAuth.AmplifyLogin(username, password);
        return response;
    } catch(error) {
        console.error(error);
        return {error: AmplifyEnum.inValidUser}
    }
};

export const forgotPassword = async (username) => {
    try {
        let response = await AmplifyAuth.SendForgotPasswordCode(username);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.USER.PASSCODE_SUCCESS})
        return response
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.USER.PASSWORD_ERROR})
    }
}

export const resetPassword = async (username, password, code) => {
    try {
       let response = await AmplifyAuth.ForgotPassword(username, password, code);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.USER.PASSWORD_SUCCESS})
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.USER.PASSWORD_ERROR});
    }
}

export const createPassword = async (username, tempPassword, newPassword) => {
    try {
        let response = await AmplifyAuth.CompletePasswordLogin(username, tempPassword, newPassword);
        publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.USER.PASSWORD_SUCCESS});
        return response;
    } catch(error) {
        console.error(error)
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.USER.PASSWORD_ERROR});
    }
}

export const signOut = createAsyncThunk('user/signOut', async () => {
    try {
        let response = await AmplifyAuth.SignOut();
        localStorage.clear();
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
    }
})

export const fetchUser = createAsyncThunk('user/fetchUser',  async (username, password, token) => {
    const url = endpoints.USERS.LOGIN;
    try {
        const newUser = User.createUser(username, password);
        const response = await client.post(url, newUser, {Authorization: token});
        localStorage.setItem("user", JSON.stringify(response[0]));
        return response[0];
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type:status.ERROR, message:status.MESSAGE.USER.LOGIN_ERROR});
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

