import { createSlice, createEntityAdapter, createAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export class PubSub {
    topic: string;
    data: any;

    constructor(topic: string, data: any){
        this.topic = topic;
        this.data = data;
    }
}

const pubSubAdapter = createEntityAdapter();

const initialState = pubSubAdapter.getInitialState({
    pubSub: {} as PubSub 
});

export const publish = createAction('pubsSub/publish', function prepare(data) {
    return {
        payload : data
    }
});

export const clear = createAction('pubSub/clear');

const pubsubSlice = createSlice({
    name: 'pubSub',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(publish, (state, action) => {
                state.pubSub = action.payload
            })
            .addCase(clear, (state, action) => {
                state.pubSub = {} as PubSub;
            })
    }
});

export const subscribe = (state: RootState) => state.pubSub.pubSub as PubSub;

export default pubsubSlice.reducer