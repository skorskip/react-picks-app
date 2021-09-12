import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const pubSubAdapter = createEntityAdapter();

const initialState = pubSubAdapter.getInitialState({
    topic: "",
    data: {}
});

const pubsubSlice = createSlice({
    name: 'pubSub',
    initialState,
    reducers: {
        publish(state, action) {
            state.topic = action.payload.topic;
            state.data = action.payload.data;
        }
    }
});

const { actions, reducer } = pubsubSlice
export const { publish } = actions
export const subscribe = (state) => state.pubSub;

export default reducer