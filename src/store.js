import { configureStore } from '@reduxjs/toolkit'
import basketSlice from './Reducers/BasketSlice'

export const store = configureStore({
  reducer: {
    basket: basketSlice,
  },
})