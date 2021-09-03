import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';
import { Game } from '../../model/game/game';
import { Team } from '../../model/team/team';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';

const gamesAdapter = createEntityAdapter();

const initialState = gamesAdapter.getInitialState({
    status: status.IDLE,
    games: [] as Game[],
    teams: [] as Team[]
});

export const fetchGames = createAsyncThunk('user/fetchGames',  async (param: SeasonRequest) => {
    try {
        const url = `${endpoints.GAMES.BASE}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, status.MESSAGE.ERROR_GENERIC);
        return {status: status.ERROR, message: error}
    }
})

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchGames.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.games = [] as Game[];
                    state.teams = [] as Team[];
                    state.status = status.ERROR;
                } else {
                    state.games = action.payload.games as Game[];
                    state.teams = action.payload.teams as Team[];
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchGames.pending, (state, action) => {
                state.status = status.LOADING
            })
    },
});

export const selectGames = (state) => state.games.games as Game[]

export const selectGamesById = (state, gameId) => state.games.games.find((game) => game.game_id === gameId) as Game;

export const selectGameIds = (state) => state.games.games.map((game) => game.game_id) as Number[];

export const selectGamesPastSubmit = (state) => state.games.games.find((game) => game.pick_submit_by_date < new Date()) as Game[];

export const selectTeams = (state) => state.games.teams as Team[]

export const selectTeamById = (state, teamId) => state.games.teams.find((team) => team.team_id === teamId) as Team; 

export default gamesSlice.reducer
