import React, { useState } from "react";
import { Car } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    'username': '',
    'email': '',
    'password': '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleRegister = async(e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axiosInstance.post('/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      navigate('/login', {
        state: {
          registeredMessage: 'We have sent you an account activation email. Activate your account before Login.'
        }
      })
    } catch (error) {
      console.log(error.response)
      // Handle Django REST Framework validation errors
      const errorData = error.response?.data
      if (errorData) {
        // Check for field-specific errors (e.g., {"username": ["A user with that username already exists."]})
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`
            }
            return `${field}: ${messages}`
          })
          .join('\n')
        setError(fieldErrors || 'Registration failed. Please try again.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
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
          Register your account
        </h2>

        {/* Form */}
        <form onSubmit={(e)=>handleRegister(e)} className="space-y-5">
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
              value={formData.username}
              onChange={(e)=>setFormData({...formData, username: e.target.value})}
              type="text"
              required
              placeholder="username"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Email address
            </label>
            <input
              value={formData.email}
              onChange={(e)=>setFormData({...formData, email: e.target.value})}
              type="email"
              required
              placeholder="you@carvo.com"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Password
            </label>
            <input
              value={formData.password}
              onChange={(e)=>setFormData({...formData, password: e.target.value})}
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

       

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition py-3 font-semibold text-black"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to='/login' className="text-emerald-500 hover:underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
