import {configureStore} from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import rentalReducer from './features/rentalSlice'
const store = configureStore({
    reducer:{
        auth: authReducer,
        rental: rentalReducer,
    }
})

export default store