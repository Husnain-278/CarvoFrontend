import React, { useState } from "react";
import { Car } from "lucide-react";
import { Link, useLocation } from 'react-router-dom'
import axiosInstance from '../api/axios'
import { useDispatch } from 'react-redux'
import {login} from '../store/features/authSlice'
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const successMessage = location.state?.registeredMessage

  // handle Login functionality
  const handleLogin = async(e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
     const response = await axiosInstance.post('/token/',{username, password})
     // Dispatch login with tokens
     dispatch(login({
       accessToken: response.data.access, 
       refreshToken: response.data.refresh, 
       username: response.data.username, 
       email: response.data.email // Will be fetched separately or decoded from token
     }))
     navigate('/')
    }
    catch (error){
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur rounded-2xl shadow-2xl p-8">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-white text-2xl font-bold">
            <Car className="w-8 h-8 text-emerald-500" />
            <span>Carvo</span>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Rent smarter. Drive better.
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-white text-xl font-semibold text-center mb-6">
          Sign in to your account
        </h2>

        {/* Form */}
        <form onSubmit={(e)=>handleLogin(e)} className="space-y-5">
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-3 rounded-xl text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
         <div>
            <label className="block text-slate-400 text-sm mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              type="text"
              required
              placeholder="username"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="accent-emerald-500" />
              Remember me
            </label>
            <Link to='/login' className="text-emerald-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition py-3 font-semibold text-black"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to='/register' className="text-emerald-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
