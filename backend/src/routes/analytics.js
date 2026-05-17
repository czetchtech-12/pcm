import { Router } from 'express'
import crypto from 'crypto'
import { supabase } from '../config/supabase.js'
import { analyticsLimiter } from '../middleware/rateLimit.js'

const router = Router()

function anonymizeIp(ip = '') {
  if (!ip) return null
  const salt = process.env.ANALYTICS_IP_SALT || process.env.JWT_SECRET || 'pcm-analytics'
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

router.post('/track', analyticsLimiter, async(req,res,next)=>{ try{
  const payload={
    path:String(req.body.path || '/').slice(0, 500),
    event:String(req.body.event || 'page_view').slice(0, 80),
    metadata:req.body.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {},
    user_agent:(req.get('user-agent') || '').slice(0, 500) || null,
    ip:null,
    ip_hash:anonymizeIp(req.ip)
  }
  const {data,error}=await supabase.from('analytics_events').insert(payload).select().single()
  if(error) return res.json({data:{tracked:false, reason:error.message}})
  res.status(201).json({data})
}catch(e){next(e)} })
export default router
