import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase.js'
import { requireAuth, requireAdmin, requireLeader } from '../middleware/auth.js'
import { resolveStorageRefs } from '../utils/crud.js'

const router = Router()
const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().max(1000).optional().nullable(),
  role: z.enum(['student', 'leader', 'admin']).optional()
}).passthrough()

function adminEmails() {
  return String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const email = req.authUser.email?.toLowerCase() || ''
    const desiredRole = adminEmails().includes(email) ? 'admin' : (req.profile?.role || 'student')
    const payload = {
      id: req.authUser.id,
      email,
      name: req.profile?.name || req.authUser.user_metadata?.name || email.split('@')[0] || 'Member',
      role: desiredRole,
      phone: req.profile?.phone || null,
      avatar_url: req.profile?.avatar_url || null
    }
    const { data, error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()
    if (error) throw error
    res.json({ data: resolveStorageRefs(data) })
  } catch (error) { next(error) }
})


router.get('/me/registrations', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*, event:events(id,title,slug,date,location,status)')
      .eq('user_id', req.authUser.id)
      .order('registered_at', { ascending: false, nullsFirst: false })
      .limit(10)
    if (error) throw error
    res.json({ data: resolveStorageRefs(data) })
  } catch (error) { next(error) }
})

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const parsed = profileSchema.omit({ role: true }).parse(req.body)
    const { data, error } = await supabase
      .from('users')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', req.authUser.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data: resolveStorageRefs(data) })
  } catch (error) { next(error) }
})

router.get('/', requireLeader, async (req, res, next) => {
  try {
    const { q, role, limit = 100, offset = 0 } = req.query
    let query = supabase.from('users').select('*', { count: 'exact' })
    if (role) query = query.eq('role', role)
    if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`)
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)
    if (error) throw error
    res.json({ data: resolveStorageRefs(data), count })
  } catch (error) { next(error) }
})

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const parsed = profileSchema.parse(req.body)
    const { data, error } = await supabase
      .from('users')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ data: resolveStorageRefs(data) })
  } catch (error) { next(error) }
})

export default router
