import { supabase } from '@/lib/supabase'

export async function getFreshAccessToken() {
  if (typeof window === 'undefined') return undefined
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || undefined
}

export function getStoredToken() {
  return undefined
}
