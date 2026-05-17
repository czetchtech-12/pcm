import { Router } from 'express'
const router = Router()
router.get('/', (_req, res) => res.json({ status: 'ok', service: 'pcm-backend', time: new Date().toISOString() }))
export default router
