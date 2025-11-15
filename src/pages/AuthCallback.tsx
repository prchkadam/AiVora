import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const [message, setMessage] = useState('Verifying your email...')
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }

        if (data.session?.user) {
          setMessage('Email verified! Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500)
        } else {
          setMessage('Session expired. Redirecting to login...')
          setTimeout(() => navigate('/login', { replace: true }), 1500)
        }
      } catch (err) {
        console.error('Verification error', err)
        setMessage('Something went wrong. Redirecting to login...')
        setTimeout(() => navigate('/login', { replace: true }), 1500)
      }
    }

    verify()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-2xl font-semibold">{message}</div>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  )
}