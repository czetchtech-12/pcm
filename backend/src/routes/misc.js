import { Router } from 'express'
import { listTable, getByIdOrSlug, insertRow, updateRow, deleteRow, makeUniqueSlug } from '../utils/crud.js'
import { requireLeader } from '../middleware/auth.js'
const router=Router()
function crud(table, filters=[]){ const r=Router(); r.get('/',(req,res,next)=>listTable(req,res,table,'*',filters).catch(next)); r.get('/:id',(req,res,next)=>getByIdOrSlug(req,res,table,'*').catch(next)); r.post('/',requireLeader,async(req,res,next)=>{ try{ const slug = await makeUniqueSlug(table, req.body.title||req.body.name, req.body.slug); await insertRow(req,res,table,{...req.body,slug}) }catch(e){next(e)} }); r.put('/:id',requireLeader,(req,res,next)=>updateRow(req,res,table,req.body).catch(next)); r.delete('/:id',requireLeader,(req,res,next)=>deleteRow(req,res,table).catch(next)); return r }
router.use('/committees', crud('committees'))
router.use('/programs', crud('programs',['status','category']))
router.use('/magazines', crud('magazines',['status']))
router.use('/announcements', crud('announcements',['status']))
export default router
