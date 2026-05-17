import { supabaseAnon, supabase } from '../config/supabase.js'

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()
    const { data, error } = await supabaseAnon.auth.getUser(token)
    if (!error && data?.user) {
      req.authUser = data.user
      const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle()
      req.profile = profile || null
    }
    next()
  } catch (error) { next(error) }
}

export async function requireAuth(req, res, next) {
  await optionalAuth(req, res, () => {})
  if (!req.authUser) return res.status(401).json({ error: 'Authentication required' })
  next()
}

export function requireRole(...roles) {
  return async (req, res, next) => {
    await requireAuth(req, res, async () => {
      const role = req.profile?.role || 'student'
      if (!roles.includes(role)) return res.status(403).json({ error: 'You do not have permission to perform this action' })
      next()
    })
  }
}

export const requireLeader = requireRole('leader', 'admin')
export const requireAdmin = requireRole('admin')
