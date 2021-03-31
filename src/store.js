import { configureStore } from '@reduxjs/toolkit'

import gamesReducer from '../src/controller/games/gamesSlice'
import userReducer from '../src/controller/user/userSlice'
import picksReducer from '../src/controller/picks/picksSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    picks: picksReducer
  }
})