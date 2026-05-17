import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.warn('Supabase environment variables are missing. Add SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to backend/.env')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceKey || anonKey || 'placeholder', {
  auth: { autoRefreshToken: false, persistSession: false }
})

export const supabaseAnon = createClient(supabaseUrl || 'https://placeholder.supabase.co', anonKey || 'placeholder')
