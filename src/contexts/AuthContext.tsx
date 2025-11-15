import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type User = {
  id: string
  email: string
  username: string
  avatar_url?: string | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Failed to fetch session', error)
        setLoading(false)
        return
      }

      if (data.session?.user) {
        await hydrateUser(data.session.user.id)
      } else {
        setLoading(false)
      }
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        await hydrateUser(session.user.id)
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const hydrateUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.error('Failed to load profile', error)
      setLoading(false)
      return
    }

    setUser({
      id: data.id,
      email: data.email,
      username: data.username,
      avatar_url: data.avatar_url ?? null,
    })
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username,
        },
      },
    })

    if (error) {
      throw error
    }

    if (!data.user) {
      throw new Error('Unable to complete sign up. Please try again.')
    }

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        email,
        username,
        created_at: new Date().toISOString(),
      },
    ])

    if (profileError) {
      throw profileError
    }

    return {
      success: true,
      message: 'Sign up successful! Please check your email to verify your account.',
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    setUser(null)
    navigate('/')
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}