import { supabase } from './supabase'
import { api } from './api'

export const signUp = async (email: string, password: string, name: string, phone?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone, role: 'student' } }
  })
  if (error) throw error
  if (data.session?.access_token) {
    await api.me(data.session.access_token)
    if (phone) await api.updateMe({ name, phone }, data.session.access_token).catch(() => null)
  }
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (data.session?.access_token) {
    await api.me(data.session.access_token)
  }
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
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` })
  if (error) throw error
}

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => supabase.auth.onAuthStateChange(callback)
