import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { User } from '../../model/user/user';

const usersUrl = environment.userServiceURL + 'users';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    status: 'idle',
});

export const fetchUser = createAsyncThunk('user/fetchUser',  async (username, password) => {
    const url = usersUrl + '/login';
    const newUser = new User(0, username, password, '', '', '', '', '', '', '');
    const response = await client.post(url, newUser);
    return response;
})   

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                userAdapter.setAll(state, action.payload)
                state.status = 'complete'
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.status = 'loading'
            })
    },
});

export const { usersLoaded } = userSlice.actions

const userSelectors = userAdapter.getSelectors((state) => state.user)

export const {
    selectAll: selectUser
} = userSelectors

export default userSlice.reducer

