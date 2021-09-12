import { createSlice, createEntityAdapter, createAction } from '@reduxjs/toolkit';

const pubSubAdapter = createEntityAdapter();

const initialState = pubSubAdapter.getInitialState({
    topic: "",
    data: {}
});

export const publish = createAction('publish');
export const pubSubClear = createAction('pubSubClear');

const pubsubSlice = createSlice({
    name: 'pubSub',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(publish, (state, action) => {
                state.topic = action.payload.topic;
                state.data = action.payload.data;
            })
            .addCase(pubSubClear, (state, action) => {
                state.topic = "";
                state.data = {};
            })
    }
});

export const subscribe = (state) => state.pubSub;

export default pubsubSlice.reducer