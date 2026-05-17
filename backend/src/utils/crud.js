import slugify from 'slugify'
import crypto from 'crypto'
import { supabase } from '../config/supabase.js'

export function makeSlug(text) {
  return slugify(String(text || ''), { lower: true, strict: true, trim: true }) || crypto.randomUUID()
}

export async function makeUniqueSlug(table, text, requestedSlug = '') {
  const base = makeSlug(requestedSlug || text)
  let slug = base
  for (let i = 0; i < 5; i += 1) {
    const { data, error } = await supabase.from(table).select('id').eq('slug', slug).maybeSingle()
    if (error) throw error
    if (!data) return slug
    slug = `${base}-${crypto.randomBytes(3).toString('hex')}`
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`
}


export function publicUrlForStorageRef(value) {
  if (typeof value !== 'string') return value
  if (!value.startsWith('storage:')) return value
  const [, bucket, ...pathParts] = value.split(':')
  const filePath = pathParts.join(':')
  if (!bucket || !filePath) return value
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export function resolveStorageRefs(row) {
  if (Array.isArray(row)) return row.map(resolveStorageRefs)
  if (!row || typeof row !== 'object') return row
  const out = { ...row }
  for (const [key, value] of Object.entries(out)) {
    if ((key.endsWith('_url') || key.endsWith('Url') || key === 'image_url' || key === 'file_url' || key === 'download_url' || key === 'avatar_url') && typeof value === 'string') {
      out[key] = publicUrlForStorageRef(value)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = resolveStorageRefs(value)
    }
  }
  return out
}

export function applyListFilters(query, req, allowedFilters = [], table = '') {
  const { q, limit = 50, offset = 0, order = 'created_at', direction = 'desc' } = req.query
  if (typeof allowedFilters === 'string') allowedFilters = allowedFilters.split(',').map(f => f.trim()).filter(Boolean)
  if (!Array.isArray(allowedFilters)) allowedFilters = []
  allowedFilters.forEach((field) => {
    if (req.query[field] !== undefined && req.query[field] !== '') query = query.eq(field, req.query[field])
  })
  if (q) {
    const searchable = {
      posts: ['title','excerpt','content','category'],
      events: ['title','description','location','category'],
      resources: ['title','description','category','type','author'],
      gallery_items: ['title','description','category','location'],
      committees: ['name','description','focus_area','meeting_location'],
      programs: ['title','description','category','schedule','location'],
      magazines: ['title','description','issue'],
      announcements: ['title','message','priority'],
      users: ['name','email','phone'],
      involvement_requests: ['name','email','phone','area_of_interest','message'],
      donations: ['donor_name','donor_email','donor_phone','purpose','transaction_reference','payment_provider']
    }
    const columns = searchable[table] || ['title','name','description']
    const safeQ = String(q).replace(/[%(),]/g, '').slice(0, 100)
    query = query.or(columns.map(col => `${col}.ilike.%${safeQ}%`).join(','))
  }
  return query.order(order, { ascending: direction === 'asc' }).range(Number(offset), Number(offset) + Number(limit) - 1)
}

export async function listTable(req, res, table, select = '*', filters = []) {
  let query = supabase.from(table).select(select, { count: 'exact' })
  query = applyListFilters(query, req, filters, table)
  const { data, error, count } = await query
  if (error) throw error
  res.json({ data: resolveStorageRefs(data), count })
}

export async function getByIdOrSlug(req, res, table, select = '*') {
  const value = req.params.id
  const column = /^[0-9a-fA-F-]{36}$/.test(value) ? 'id' : 'slug'
  const { data, error } = await supabase.from(table).select(select).eq(column, value).maybeSingle()
  if (error) throw error
  if (!data) return res.status(404).json({ error: 'Not found' })
  res.json({ data: resolveStorageRefs(data) })
}

export async function insertRow(req, res, table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select().single()
  if (error) throw error
  res.status(201).json({ data })
}

export async function updateRow(req, res, table, payload) {
  const { data, error } = await supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single()
  if (error) throw error
  res.json({ data: resolveStorageRefs(data) })
}

export async function deleteRow(req, res, table) {
  const role = req.profile?.role || 'student'
  if (role !== 'admin') {
    const { data: existing, error: readError } = await supabase.from(table).select('id,created_by,uploaded_by,author_id').eq('id', req.params.id).maybeSingle()
    if (readError) throw readError
    const owner = existing?.created_by || existing?.uploaded_by || existing?.author_id
    if (!owner || owner !== req.authUser?.id) return res.status(403).json({ error: 'Only admins or the original creator can delete this record.' })
  }
  const { error } = await supabase.from(table).delete().eq('id', req.params.id)
  if (error) throw error
  res.status(204).end()
}
