import {  createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../utils/client'
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { Game } from '../../model/game/game';
import { Team } from '../../model/team/team';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { RootState } from '../../store';

const gamesAdapter = createEntityAdapter();

const initialState = gamesAdapter.getInitialState({
    status: status.IDLE,
    setWeek: null as number | null,
    games: [] as Game[],
    teams: [] as Team[]
});

export const fetchGames = createAsyncThunk('user/fetchGames',  async (param: SeasonRequest) => {
    try {
        const url = `${endpoints.GAMES.BASE}?season=${param.season}&seasonType=${param.seasonType}&week=${param.week}`
        const response = await client.get(url);
        return { response: response, week: param.week };
    } catch(error) {
        console.error(error);
        return {status: status.ERROR, message: error, week: null}
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
                    state.status = status.ERROR;
                } else {
                    state.games = action.payload.response.games as Game[];
                    state.teams = action.payload.response.teams as Team[];
                    state.setWeek = action.payload.week;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchGames.pending, (state, action) => {
                state.status = status.LOADING
            })
    },
});

export const selectGames = (state: RootState) => state.games.games as Game[]

export const selectGamesById = (state: RootState, gameId: number) => state.games.games.find((game: Game) => game.game_id === gameId) as Game;

export const selectGameIds = (state: RootState) => state.games.games.map((game: Game) => game.game_id) as number[];

export const selectGamesPastSubmit = (state: RootState) => state.games.games.find((game: Game) => new Date(game.pick_submit_by_date) < new Date()) as Game;

export const selectTeams = (state: RootState) => state.games.teams as Team[]

export const selectTeamById = (state: RootState, teamId: number) => state.games.teams.find((team: Team) => team.team_id === teamId) as Team; 

export const getSetWeek = (state: RootState) => state.games.setWeek;

export const showSubmitByGameId = (state: RootState, gameId: number, prevGameId: number | null ) => {
    let currGame = state.games.games.find(game => game.game_id === gameId);
    let submitTime1 = currGame == null ? null : currGame.pick_submit_by_date;
    
    if(submitTime1 != null && prevGameId == null) {
        return (new Date(submitTime1) > new Date()) as boolean;
    } else if(submitTime1 != null && prevGameId != null){
        let submitTime2 = state.games.games.find(game => game.game_id === prevGameId)?.pick_submit_by_date;
        return ((submitTime1 !== submitTime2) && (new Date(submitTime1) > new Date())) as boolean;
    } else {
        return false;
    }
}

export default gamesSlice.reducer
