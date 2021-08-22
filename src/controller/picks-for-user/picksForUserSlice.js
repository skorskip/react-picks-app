import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { endpoints } from '../../configs/endpoints';
import { status } from '../../configs/status';
import { publish, SHOW_MESSAGE } from '../../utils/pubSub';

const picksForUserAdapter = createEntityAdapter();

const initialState = picksForUserAdapter.getInitialState({
    status: status.IDLE,
    picksForUser: []
});

export const fetchPicksForUser = createAsyncThunk('picksForUser/fetchPicksForUser', async (params) => {
    const url = `${endpoints.PICKS.OTHERS_BY_WEEK}?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&user=${params.userId}`;
    try {
        const response = await client.get(url);
        return response;
    } catch(error) {
        console.error(error);
        publish(SHOW_MESSAGE, {type:status.ERROR, message: status.MESSAGE.ERROR_GENERIC});
        return {status: status.ERROR, message: error}
    }
})

const gameSort = (a, b) => {
    if(a.game_id > b.game_id) return 1;
    if(b.game_id > a.game_id) return -1;
    return 0;
}   

const picksForUserSlice = createSlice({
    name: 'picksForUser',
    initialState,
    extraReducers : (builder) => {
        builder
            .addCase(fetchPicksForUser.fulfilled, (state, action) => {
                if(action.payload?.status === status.ERROR) {
                    state.picksForUser = [];
                    state.status = status.ERROR;
                } else {
                    const picks = action.payload.picks;
                    const teams = action.payload.teams;
                    const games = action.payload.games;

                    picks.sort(gameSort);
                    games.sort(gameSort);

                    const picksList = [];

                    for(var i = 0; i < games.length; i++) {
                        const game = games[i];

                        const gameObject = {
                        game: game,
                        awayTeam: teams.find(team => team.team_id === game.away_team_id),
                        homeTeam: teams.find(team => team.team_id === game.home_team_id),
                        pick: picks[i],
                        winning_team_id: game.winning_team_id,
                        game_status: game.game_status 
                        }
                
                        picksList.push(gameObject);
                    }

                    state.picksForUser = picksList;
                    state.status = status.COMPLETE;
                }
            })
            .addCase(fetchPicksForUser.pending, (state, action) => {
                state.status = status.LOADING;
            })
    }
});

export const selectPicksForUser = (state) => state.picksForUser.picksForUser;

export default picksForUserSlice.reducer