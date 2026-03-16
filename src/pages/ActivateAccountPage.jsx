import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Car, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import axiosInstance from '../api/axios'

const statusCopy = {
  loading: {
    title: 'Activating your account…',
    color: 'text-blue-400',
    icon: <Loader2 className="w-12 h-12 animate-spin" />,
  },
  success: {
    title: 'Account activated!',
    color: 'text-emerald-400',
    icon: <CheckCircle2 className="w-12 h-12" />,
  },
  error: {
    title: 'Activation failed',
    color: 'text-red-400',
    icon: <XCircle className="w-12 h-12" />,
  },
}

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Activation token is missing.')
        return
      }

      try {
        const response = await axiosInstance.get(`/activate/?token=${token}`)
        setStatus('success')
        setMessage(response?.data?.detail || 'Your account is now active. You can sign in.')
      } catch (error) {
        setStatus('error')
        const detail = error?.response?.data?.detail
        setMessage(detail || 'We could not activate your account. Try requesting a new link.')
      }
    }

    activate()
  }, [token])

  const copy = statusCopy[status]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur rounded-2xl shadow-2xl p-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 text-white text-2xl font-bold">
          <Car className="w-8 h-8 text-emerald-500" />
          <span>Carvo</span>
        </div>

        <div className={`flex flex-col items-center gap-3 ${copy.color}`}>
          {copy.icon}
          <h1 className="text-2xl font-semibold text-white">{copy.title}</h1>
          {message && <p className="text-slate-300 text-base text-center max-w-md">{message}</p>}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition"
          >
            Go to login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-700 text-slate-200 font-semibold hover:border-emerald-500 hover:text-emerald-400 transition"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ActivateAccountPage
