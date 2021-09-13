import { configureStore } from '@reduxjs/toolkit'

import gamesReducer from '../src/controller/games/gamesSlice'
import userReducer from '../src/controller/user/userSlice'
import picksReducer from '../src/controller/picks/picksSlice'
import leagueReducer from '../src/controller/league/leagueSlice'
import userPickDataReducer from '../src/controller/user-pick-data/userPickDataSlice'
import announcementsReducer from '../src/controller/announcements/announcementsSlice'
import userStandingsReducer from '../src/controller/user-standings/userStandingsSlice'
import tokenReducer from '../src/controller/token/tokenSlice'
import picksForUserReducer from '../src/controller/picks-for-user/picksForUserSlice'
import userDetailsReducer from '../src/controller/user-details/userDetailsSlice'
import PubSubReducer from '../src/controller/pubSub/pubSubSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    picks: picksReducer,
    league: leagueReducer,
    userPickData: userPickDataReducer,
    announcements: announcementsReducer,
    userStandings: userStandingsReducer,
    token: tokenReducer,
    picksForUser: picksForUserReducer,
    userDetails: userDetailsReducer,
    pubSub: PubSubReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store