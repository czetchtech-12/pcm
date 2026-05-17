import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { requireLeader, requireAdmin } from '../middleware/auth.js'
const router=Router()
const tables=['users','posts','events','event_attendees','resources','gallery_items','prayer_requests','counseling_requests','donations','newsletter_subscribers','committees','programs','magazines','announcements','involvement_requests']
router.get('/stats', requireLeader, async(_req,res,next)=>{ try{ const stats={}; for(const t of tables){ const {count}=await supabase.from(t).select('id',{count:'exact',head:true}); stats[t]=count||0 } res.json({data:stats}) }catch(e){next(e)} })
router.get('/backup', requireAdmin, async(req,res,next)=>{ try{ const limit=Math.min(Number(req.query.limit||1000),5000); const backup={exported_at:new Date().toISOString(), row_limit_per_table:limit, warning:'Backup is limited per table to avoid deployment timeouts. Use ?limit=5000 for larger exports or export directly from Supabase for full database backups.', tables:{}}; for(const t of tables){ const {data,error,count}=await supabase.from(t).select('*',{count:'exact'}).range(0,limit-1); backup.tables[t]=error ? {error:error.message} : { count, returned:data?.length||0, rows:data||[] } } res.json({data:backup}) }catch(e){next(e)} })
export default router
