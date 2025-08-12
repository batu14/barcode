import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: window.localStorage.getItem('basket') ? window.localStorage.getItem('basket') : [],
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,

    reducers: {
        addBasket: (state, action) => {
        state.value.push(action.payload)
        window.localStorage.setItem('basket', state.value)
        },
        removeBasket: (state, action) => {
        state.value = state.value.filter((item, index) => index !== action.payload)
        window.localStorage.setItem('basket', state.value)
        },
    },
  
})

// Action creators are generated for each case reducer function

export const { addBasket, removeBasket } = basketSlice.actions
export default basketSlice.reducer

