import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const teamsAdapter = createEntityAdapter();

const teamsSlice = createSlice({
    name: 'teams',
    initialState: teamsAdapter.getInitialState(),
    reducers: {
        setTeamsSlice : {
            reducer(state, action) {
                teamsAdapter.setAll(state, action.payload);
            },
            prepare(teams) {
                return {
                    payload: teams
                }
            }
        }
    }
});

export const { setTeamsSlice } = teamsSlice.actions

const teamsSelectors = teamsAdapter.getSelectors((state) => state.teams)

export const {
    selectAll: selectTeams,
    selectById: selectTeamsById
} = teamsSelectors

export default teamsSlice.reducer;