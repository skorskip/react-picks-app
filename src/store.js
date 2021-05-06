import { configureStore } from '@reduxjs/toolkit'

import gamesReducer from '../src/controller/games/gamesSlice'
import userReducer from '../src/controller/user/userSlice'
import picksReducer from '../src/controller/picks/picksSlice'
import leagueReducer from '../src/controller/league/leagueSlice'
import userPickDataReducer from '../src/controller/user-pick-data/userPickDataSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    picks: picksReducer,
    league: leagueReducer,
    userPickData: userPickDataReducer
  }
})