import { configureStore } from '@reduxjs/toolkit'

import gamesReducer from '../src/controller/games/gamesSlice'
import userReducer from '../src/controller/user/userSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
  }
})