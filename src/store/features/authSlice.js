import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name:'auth',
    initialState:{
         accessToken: localStorage.getItem('accessToken') || null,
         refreshToken: localStorage.getItem('refreshToken') || null,
         isAuthenticated: !!localStorage.getItem('accessToken'),
         username: localStorage.getItem('username') || null,
         email : localStorage.getItem('email') || null,
         loading: false,
         error: null 
    },
    reducers:{
        login: (state, action)=>{
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.username = action.payload.username
            state.email = action.payload.email
            state.isAuthenticated = true
            state.error = null
            
            // Persist to localStorage
            localStorage.setItem('accessToken', action.payload.accessToken)
            localStorage.setItem('refreshToken', action.payload.refreshToken)
            localStorage.setItem('username', action.payload.username)
            localStorage.setItem('email', action.payload.email)
        },
        logout: (state, action)=>{
            state.accessToken = null
            state.refreshToken = null
            state.email = null
            state.username = null
            state.isAuthenticated = false
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('username')
            localStorage.removeItem('email')
        },
        dashboard: (state, action)=>{}
    }
})

 export const {login, logout, dashboard} = authSlice.actions
 export default authSlice.reducer