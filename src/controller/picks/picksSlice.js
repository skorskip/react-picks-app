import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { environment } from '../../configs/environment';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const pickUrl = environment.picksServiceURL + 'picks';

const picksAdapter = createEntityAdapter();

const initialState = picksAdapter.getInitialState({
    status: status.IDLE,
    picks: []
});

export const fetchPicks = createAsyncThunk('picks/fetchPicks',  async (param) => {
    const url = `${pickUrl}/week?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`;
    const response = await client.post(url, param.user);
    return response;
});

export const addPicks = createAsyncThunk('picks/addPicks', async (param) => {
    const url = pickUrl + '/create';
    const response = await client.post(url, param.picks);

    try {
        var updated = [];
        param.picks.forEach((newPick, index) => {
            newPick.pick_id = parseInt(response.result) + index;
            updated.push(newPick);
        });
        return updated;
    } catch(error) {
        return {status: status.ERROR, message: error}
    }
});

export const updatePicks = createAsyncThunk('picks/updatePicks', async (param) => {
    for(const pick of param.picks) {
        const url = pickUrl + '/' + pick.pick_id;
        try {
            await client.put(url, pick);
        } catch(error) {
            return {status: status.ERROR, message: error};
        }
    }
    return param.picks;
});

export const deletePicks = createAsyncThunk('picks/deletePicks', async (param) => {
    for(const pick_id of param.picks){
        const url = pickUrl + '/' + pick_id;
        try{
            await client.delete(url);
        } catch(error) {
            return {status: status.ERROR, message: error};
        }
    };
    return param.picks;
 });

const picksSlice = createSlice({
    name: 'picks',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(fetchPicks.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.picks = [];
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
                } else {
                    state.picks = action.payload.picks;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(addPicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(addPicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    state.picks = state.picks.concat(action.payload);
                    state.status = status.COMPLETE;
                    publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.ADD_SUCCESS});

                } else {
                    state.picks = [];
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
                }
            })
            .addCase(updatePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(updatePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    for(const pick of action.payload){
                        for(var i = 0; i < state.picks.length; i++) {
                            if(state.picks[i].pick_id === pick.pick_id) {
                                state.picks[i] = pick;
                                break;
                            }
                        }
                    }
                    state.status = status.COMPLETE;
                    publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.EDIT_SUCCESS});
                } else {
                    state.picks = [];
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
                }
            })
            .addCase(deletePicks.pending, (state, action) => {
                state.status = status.LOADING;
            })
            .addCase(deletePicks.fulfilled, (state, action) => {
                if(action.payload?.status !== status.ERROR) {
                    const filtered = state.picks.filter(pick => !action.payload.includes(pick.pick_id));
                    state.picks = filtered;
                    state.status = status.COMPLETE;
                    publish(SHOW_MESSAGE, {type: status.SUCCESS, message: status.MESSAGE.PICKS.EDIT_SUCCESS});
                } else {
                    state.picks = [];
                    state.status = status.ERROR;
                    console.error(action.payload.message);
                    publish(SHOW_MESSAGE, {type: status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
                }
            })
    },
});

export const selectPicks = (state) => state.picks.picks;

export const selectPicksById = (state, pickId) => state.picks.picks.find((pick) => pick.pick_id === pickId);

export const selectPicksIds = (state) => state.picks.picks.map((pick) => pick.pick_id);

export const selectPicksGamesIds = (state) => state.picks.picks.map((pick) => pick.game_id);

export default picksSlice.reducer
