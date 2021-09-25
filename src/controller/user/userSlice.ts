import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import AmplifyAuth, { AmplifyEnum } from '../../utils/amplifyAuth';
import { status } from '../../configs/status';
import { clearAllLocal } from '../../utils/localData';
import { RootState } from '../../store';
import { User } from '../../model/user/user';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: status.IDLE,
    user: {} as User
});

export const login = async (username: string, password: string) => {
    try {
        let response = await AmplifyAuth.AmplifyLogin(username, password);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, response: null, error: AmplifyEnum.inValidUser}
    }
};

export const forgotPassword = async (username: string) => {
    try {
        let response = await AmplifyAuth.SendForgotPasswordCode(username);
        return response
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, response: error}
    }
}

export const resetPassword = async (username: string, password: string, code: string) => {
    try {
        let response = await AmplifyAuth.ForgotPassword(username, password, code);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, response: error}
    }
}

export const createPassword = async (username: string, tempPassword: string, newPassword: string) => {
    try {
        let response = await AmplifyAuth.CompletePasswordLogin(username, tempPassword, newPassword);   
        return response;
    } catch(error) {
        console.error(error)
        return {status: status.ERROR, response: error}
    }
}

export const signOut = createAsyncThunk('user/signOut', async () => {
    try {
        let response = await AmplifyAuth.SignOut();
        clearAllLocal();
        return response;
    } catch(error) {
        console.error(error);
    }
})

export const fetchUser = createAsyncThunk('user/fetchUser',  async (token) => {
    const url = endpoints.USERS.LOGIN;
    try {
        const response = await client.get(url, {Authorization: token});
        return response[0];
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error}
    }
})   

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
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
                state.user = {} as User
                state.status = status.IDLE;
            })
    },
});

export const selectUser = (state: RootState) => state.user.user as User;

export default userSlice.reducer

