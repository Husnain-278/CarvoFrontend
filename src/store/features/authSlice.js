import {createSlice} from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

const authSlice = createSlice({
    name:'auth',
        initialState:{
            accessToken: localStorage.getItem('accessToken') || null,
            refreshToken: localStorage.getItem('refreshToken') || null,
            isAuthenticated: !!localStorage.getItem('accessToken'),
            username: localStorage.getItem('username') || null,
            email : localStorage.getItem('email') || null,
            loading: false,
            error: null,
            profile: null,
            profileStatus: 'idle',
            profileError: null,
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
        dashboard: (state, action)=>{},
        fetchProfileStart: (state) => {
            state.profileStatus = 'loading'
            state.profileError = null
        },
        fetchProfileSuccess: (state, action) => {
            state.profileStatus = 'succeeded'
            state.profile = action.payload
        },
        fetchProfileFailure: (state, action) => {
            state.profileStatus = 'failed'
            state.profileError = action.payload || 'Unable to load profile'
        },
    }
})

 export const {
    login,
    logout,
    dashboard,
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
 } = authSlice.actions
 export default authSlice.reducer

const extractError = (error) => {
    const data = error.response?.data
    if (!data) return error.message || 'Something went wrong.'
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    return Object.values(data).flat().join(' ')
}

export const fetchUserProfile = () => async (dispatch) => {
    try {
        dispatch(fetchProfileStart())
        const response = await axiosInstance.get('/user-profile/')
        dispatch(fetchProfileSuccess(response.data))
    } catch (error) {
        dispatch(fetchProfileFailure(extractError(error)))
    }
}