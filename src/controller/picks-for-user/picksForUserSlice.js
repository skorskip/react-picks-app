import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../utils/client';
import { environment } from '../../configs/environment';

const picksForUserUrl = environment.picksServiceURL + 'picks/others';

const picksForUserAdapter = createEntityAdapter();

const initialState = picksForUserAdapter.getInitialState({
    status: 'idle',
    picksForUser: []
});

export const fetchPicksForUser = createAsyncThunk('picksForUser/fetchPicksForUser', async (params) => {
    const url = `${picksForUserUrl}?season=${params.season}&seasonType=${params.seasonType}&week=${params.week}&user=${params.userId}`;
    const response = await client.get(url);
    return response;
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
                      pick: picks[i]
                    }
              
                    picksList.push(gameObject);
                }

                state.picksForUser = picksList;
                state.status = 'complete'
            })
            .addCase(fetchPicksForUser.pending, (state, action) => {
                state.status = 'loading'
            })
    }
});

export const selectPicksForUser = (state) => state.picksForUser.picksForUser;

export default picksForUserSlice.reducer