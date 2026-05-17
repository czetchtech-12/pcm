import { Router } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

const searchTables = [
  { table: 'posts', select: 'title,excerpt,slug,category,published_at', columns: ['title', 'excerpt', 'content', 'category'] },
  { table: 'events', select: 'title,description,slug,category,date,location', columns: ['title', 'description', 'location', 'category'] },
  { table: 'resources', select: 'title,description,slug,type,created_at,author', columns: ['title', 'description', 'category', 'author', 'type'] },
  { table: 'programs', select: 'title,description,slug,category,created_at', columns: ['title', 'description', 'category', 'leader_name'] }
]

function cleanSearchTerm(value) {
  return String(value || '')
    .trim()
    .replace(/[\\%(),]/g, ' ')
    .replace(/\s+/g, ' ')
}

router.get('/', async (req, res, next) => {
  try {
    const q = cleanSearchTerm(req.query.q)
    if (!q) return res.json({ data: [] })

    const results = []

    for (const config of searchTables) {
      const orFilter = config.columns.map((column) => `${column}.ilike.%${q}%`).join(',')
      const { data, error } = await supabase
        .from(config.table)
        .select(config.select)
        .or(orFilter)
        .limit(8)

      if (error) {
        console.warn(`Search skipped ${config.table}:`, error.message)
        continue
      }

      if (data) results.push(...data.map((item) => ({ table: config.table, ...item })))
    }

    res.json({ data: results })
  } catch (error) { next(error) }
})

export default router
