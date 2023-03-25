import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import AmplifyAuth, { AmplifyEnum } from '../../utils/amplifyAuth';
import { status } from '../../configs/status';
import { clearAllLocal } from '../../utils/localData';
import { RootState } from '../../store';
import { User } from '../../model/user/user';
import { publish, PubSub } from '../pubSub/pubSubSlice';
import { SnackMessage } from '../../components/message/messagePopup';
import { SHOW_MESSAGE } from '../../configs/topics';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: status.IDLE,
    user: {} as User,
    setProfileStatus: status.IDLE,
    bonus: [] as User[],
    bonusState: status.IDLE
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
};

export const resetPassword = async (username: string, password: string, code: string) => {
    try {
        let response = await AmplifyAuth.ForgotPassword(username, password, code);
        return response;
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, response: error}
    }
};

export const createPassword = async (username: string, tempPassword: string, newPassword: string) => {
    try {
        let response = await AmplifyAuth.CompletePasswordLogin(username, tempPassword, newPassword);   
        return response;
    } catch(error) {
        console.error(error)
        return {status: status.ERROR, response: error}
    }
};

export const signOut = createAsyncThunk('user/signOut', async (_, {dispatch}) => {
    try {
        let response = await AmplifyAuth.SignOut();
        clearAllLocal();
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
    }
});

export const fetchUser = createAsyncThunk('user/fetchUser',  async (token, {dispatch}) => {
    const url = endpoints.USERS.LOGIN;
    try {
        const response = await client.get(url, {Authorization: token});
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
        return {status: status.ERROR, message: error}
    }
});

export const fetchUpdateProfile = createAsyncThunk('user/fetchUpdateProfile', async (_, {dispatch}) => {
    try {
        const url = endpoints.USERS.UPDATE_PROFILE;
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
        return {status: status.ERROR, message: error}
    }
}); 

export const fetchBonusEligible = createAsyncThunk('user/fetchBonusEligble', async (param: SeasonRequest, {dispatch}) => {
    try {
        const url = endpoints.USERS.BONUS_USERS(param);
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        let request = new PubSub(SHOW_MESSAGE, 
            new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
        dispatch(publish(request));
        return {status: status.ERROR, message: error}
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            // GET USER
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

            // SIGN OUT USER
            .addCase(signOut.fulfilled, (state, action) => {
                state.user = {} as User
                state.status = status.IDLE;
            })

            // UPDATE USER PROFILE
            .addCase(fetchUpdateProfile.pending, (state, action) => {
                state.setProfileStatus = status.LOADING;
            })
            .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.setProfileStatus = status.ERROR;
                } else {
                    state.setProfileStatus = status.COMPLETE;
                }
            })

            // GET BONUS ELIGIBLE
            .addCase(fetchBonusEligible.pending, (state, action) => {
                state.bonusState = status.LOADING
            })
            .addCase(fetchBonusEligible.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.bonusState = status.ERROR;
                } else {
                    state.bonus = action.payload;
                    state.bonusState = status.COMPLETE;
                }
            })
    },
});

export const selectUser = (state: RootState) => state.user.user as User;

export const selectBonusEligible = (state: RootState) => state.user.bonus as User[];

export default userSlice.reducer

