import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const pubSubAdapter = createEntityAdapter();

const initialState = pubSubAdapter.getInitialState({
    topic: "",
    data: {} as any
});

const pubsubSlice = createSlice({
    name: 'pubsub',
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

export default reducer