import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { User } from '../../model/user/user';

const usersUrl = environment.userServiceURL + 'users';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: localStorage.getItem("user") === null ? 'idle' :'complete',
    user: localStorage.getItem("user") === null ? {} : JSON.parse(localStorage.getItem("user"))
});

export const fetchUser = createAsyncThunk('user/fetchUser',  async (username, password) => {
    const url = usersUrl + '/login';
    const newUser = new User(0, username, password, '', '', '', '', '', '', '');
    const response = await client.post(url, newUser);
    localStorage.setItem("user", JSON.stringify(response[0]));
    return response[0];
})   

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.status = 'complete'
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.status = 'loading'
            })
    },
});

export const { usersLoaded } = userSlice.actions

export const selectUser = (state) => state.user.user;

export default userSlice.reducer

