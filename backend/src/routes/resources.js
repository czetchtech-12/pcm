import { Router } from 'express'
import { z } from 'zod'
import { listTable, getByIdOrSlug, insertRow, updateRow, deleteRow, makeUniqueSlug } from '../utils/crud.js'
import { requireLeader } from '../middleware/auth.js'
const router=Router()
const schema=z.object({ title:z.string().min(2), description:z.string().min(1), type:z.string().default('bible_study'), category:z.string().default('General'), file_url:z.string().optional().nullable(), download_url:z.string().optional().nullable(), duration:z.string().optional().nullable(), lessons:z.number().optional().nullable(), level:z.string().default('beginner'), author:z.string().default('CBU SDA PCM'), status:z.string().default('published') }).passthrough()
router.get('/', (req,res,next)=>listTable(req,res,'resources','*',['type','category','level','status']).catch(next))
router.get('/:id', (req,res,next)=>getByIdOrSlug(req,res,'resources','*').catch(next))
router.post('/', requireLeader, async(req,res,next)=>{ try{ const p=schema.parse(req.body); const slug = await makeUniqueSlug('resources', p.title, req.body.slug); await insertRow(req,res,'resources',{...p,slug}) }catch(e){next(e)} })
router.put('/:id', requireLeader, async(req,res,next)=>{ try{ const p=schema.partial().parse(req.body); if(p.title&&!req.body.slug) p.slug=await makeUniqueSlug('resources', p.title); await updateRow(req,res,'resources',p) }catch(e){next(e)} })
router.delete('/:id', requireLeader, (req,res,next)=>deleteRow(req,res,'resources').catch(next))
export default router
