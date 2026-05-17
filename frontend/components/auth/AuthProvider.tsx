"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { User as UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  accessToken: string | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<UserProfile | null>
  getAccessToken: () => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  accessToken: null,
  profile: null,
  loading: true,
  refreshProfile: async () => null,
  getAccessToken: async () => null,
  signOut: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const syncProfile = async (token?: string | null): Promise<UserProfile | null> => {
    if (!token) {
      setProfile(null)
      return null
    }
    try {
      const result = await api.me(token)
      setProfile(result.data)
      return result.data
    } catch (error) {
      console.error('Error syncing user profile:', error)
      setProfile(null)
      return null
    }
  }

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || null
    setSession(session || null)
    setUser(session?.user ?? null)
    setAccessToken(token)
    return token
  }

  const refreshProfile = async () => {
    const token = await getAccessToken()
    return syncProfile(token)
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session || null)
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token || null)
      if (session?.access_token) await syncProfile(session.access_token)
      else setProfile(null)
      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session || null)
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token || null)
      if (session?.access_token) await syncProfile(session.access_token)
      else setProfile(null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    setSession(null)
    setAccessToken(null)
    setProfile(null)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, accessToken, profile, loading, refreshProfile, getAccessToken, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
