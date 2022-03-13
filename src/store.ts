import { configureStore, ThunkDispatch, Action } from '@reduxjs/toolkit'

import weekReducer from './controller/week/weekSlice'
import userReducer from '../src/controller/user/userSlice'
import leagueReducer from '../src/controller/league/leagueSlice'
import announcementsReducer from '../src/controller/announcements/announcementsSlice'
import userStandingsReducer from '../src/controller/user-standings/userStandingsSlice'
import tokenReducer from '../src/controller/token/tokenSlice'
import picksForUserReducer from '../src/controller/picks-for-user/picksForUserSlice'
import PubSubReducer from '../src/controller/pubSub/pubSubSlice'
import { useDispatch } from 'react-redux'

const store = configureStore({
  reducer: {
    user: userReducer,
    week: weekReducer,
    league: leagueReducer,
    announcements: announcementsReducer,
    userStandings: userStandingsReducer,
    token: tokenReducer,
    picksForUser: picksForUserReducer,
    pubSub: PubSubReducer
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
//export type AppDispatch = typeof store.dispatch
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();


export default store