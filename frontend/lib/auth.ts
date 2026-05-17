import { supabase } from './supabase'
import { api } from './api'

async function trySyncProfile(token?: string | null) {
  if (!token) return
  try {
    await api.me(token)
  } catch (error) {
    // Do not block login if the profile-sync API is temporarily unavailable.
    // AuthProvider will try again and the member dashboard can still use Supabase session data.
    console.warn('Profile sync skipped:', error)
  }
}

export const signUp = async (email: string, password: string, name: string, phone?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name, phone, role: 'student' },
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
    }
  })
  if (error) throw error
  if (data.session?.access_token) {
    await trySyncProfile(data.session.access_token)
    if (phone || name) await api.updateMe({ name, phone }, data.session.access_token).catch(() => null)
  }
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  })
  if (error) throw error
  await trySyncProfile(data.session?.access_token)
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/login` })
  if (error) throw error
}

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => supabase.auth.onAuthStateChange(callback)
