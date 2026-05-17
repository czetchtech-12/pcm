import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase.js'
import { listTable, getByIdOrSlug, insertRow, updateRow, deleteRow, makeUniqueSlug } from '../utils/crud.js'
import { optionalAuth, requireLeader } from '../middleware/auth.js'
import { notifyAdmins } from '../utils/mailer.js'
const router=Router()
const eventCategories = ['worship', 'outreach', 'study', 'fellowship', 'special']
const eventStatuses = ['draft', 'published', 'archived']
const eventSchema=z.object({ title:z.string().min(2), description:z.string().min(1), date:z.string(), end_date:z.string().optional().nullable(), location:z.string().min(1), max_attendees:z.number().optional().nullable(), category:z.enum(eventCategories).default('fellowship'), image_url:z.string().optional().nullable(), status:z.enum(eventStatuses).default('published') }).passthrough()
router.get('/', (req,res,next)=>listTable(req,res,'events','*',['category','status']).catch(next))
router.get('/:id', (req,res,next)=>getByIdOrSlug(req,res,'events','*').catch(next))
router.post('/', requireLeader, async(req,res,next)=>{ try{ const p=eventSchema.parse(req.body); const slug = await makeUniqueSlug('events', p.title, req.body.slug); await insertRow(req,res,'events',{...p,slug,created_by:req.authUser?.id,current_attendees:0}) }catch(e){next(e)} })
router.put('/:id', requireLeader, async(req,res,next)=>{ try{ const p=eventSchema.partial().parse(req.body); if(p.title&&!req.body.slug) p.slug=await makeUniqueSlug('events', p.title); await updateRow(req,res,'events',p) }catch(e){next(e)} })
router.delete('/:id', requireLeader, (req,res,next)=>deleteRow(req,res,'events').catch(next))
router.post('/:id/register', optionalAuth, async(req,res,next)=>{ try{ const lookupColumn=/^[0-9a-fA-F-]{36}$/.test(req.params.id) ? 'id' : 'slug'; const { data: eventRow, error: eventLookupError } = await supabase.from('events').select('id,title,slug').eq(lookupColumn, req.params.id).maybeSingle(); if (eventLookupError) throw eventLookupError; if (!eventRow) return res.status(404).json({ error: 'Event not found' }); const event_id=eventRow.id; const row={event_id,user_id:req.authUser?.id || null,name:req.body.name,email:req.body.email,phone:req.body.phone};
  if (row.user_id) {
    const { data: existing, error: checkError } = await supabase.from('event_attendees').select('id').eq('event_id', event_id).eq('user_id', row.user_id).maybeSingle()
    if (checkError) throw checkError
    if (existing) return res.status(409).json({ error: 'You are already registered for this event.' })
  }
  const {data,error}=await supabase.from('event_attendees').insert(row).select().single(); if(error) throw error; const { error: rpcError } = await supabase.rpc('increment_event_attendees',{ event_id_input:event_id }); if (rpcError) console.warn('increment_event_attendees failed:', rpcError.message); await notifyAdmins('New event registration', `Event: ${eventRow.title || event_id}\nName: ${row.name}\nEmail: ${row.email}`); res.status(201).json({data,message:'Registration received'}) }catch(e){next(e)} })
router.get('/:id/attendees', requireLeader, async(req,res,next)=>{ try{ const {data,error}=await supabase.from('event_attendees').select('*').eq('event_id',req.params.id).order('created_at',{ascending:false}); if(error) throw error; res.json({data}) }catch(e){next(e)} })
router.get('/:id/attendees.csv', requireLeader, async(req,res,next)=>{ try{ const {data,error}=await supabase.from('event_attendees').select('*').eq('event_id',req.params.id).order('created_at',{ascending:false}); if(error) throw error; const { data: event } = await supabase.from('events').select('title,slug').eq('id',req.params.id).maybeSingle(); const rows=[['Event','Event Slug','Name','Email','Phone','Registered At'], ...(data||[]).map(a=>[event?.title||req.params.id,event?.slug||'',a.name||'',a.email||'',a.phone||'',a.created_at||a.registered_at||''])]; const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n'); res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition',`attachment; filename="event-${req.params.id}-attendees.csv"`); res.send(csv) }catch(e){next(e)} })
export default router
