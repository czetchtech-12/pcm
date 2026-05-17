import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { supabase } from '../config/supabase.js'
import { requireAuth, requireLeader } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
})

function cleanName(name = 'upload') {
  const ext = path.extname(name).toLowerCase()
  const base = path.basename(name, ext).replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'file'
  return `${Date.now()}-${base}${ext}`
}

async function ensureBucket(bucket) {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === bucket)) {
    await supabase.storage.createBucket(bucket, { public: true }).catch(() => null)
  }
}

function uploadGuard(req, res, next) {
  if (String(req.body?.bucket || '').toLowerCase() === 'avatars') return requireAuth(req, res, next)
  return requireLeader(req, res, next)
}

router.post('/', upload.single('file'), uploadGuard, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const bucket = String(req.body.bucket || 'public').replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'public'
    const folder = String(req.body.folder || 'uploads').replace(/[^a-z0-9-_\/]/gi, '').replace(/^\/+|\/+$/g, '') || 'uploads'
    if (bucket === 'avatars' && !String(req.file.mimetype || '').startsWith('image/')) return res.status(400).json({ error: 'Profile picture must be an image file.' })
    await ensureBucket(bucket)
    const ownerFolder = bucket === 'avatars' ? `${folder}/${req.authUser.id}` : folder
    const filePath = `${ownerFolder}/${cleanName(req.file.originalname)}`
    const { error } = await supabase.storage.from(bucket).upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false
    })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    res.status(201).json({ data: { bucket, path: filePath, storageRef: `storage:${bucket}:${filePath}`, publicUrl: data.publicUrl } })
  } catch (error) { next(error) }
})

export default router
