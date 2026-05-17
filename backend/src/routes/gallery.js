import { Router } from 'express'
import multer from 'multer'
import { supabase } from '../config/supabase.js'
import { listTable, getByIdOrSlug, insertRow, updateRow, deleteRow, makeUniqueSlug } from '../utils/crud.js'
import { requireAuth, requireLeader } from '../middleware/auth.js'
const router=Router(); const upload=multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024}})
router.get('/', (req,res,next)=>listTable(req,res,'gallery_items','*',['category','status']).catch(next))
router.get('/:id', (req,res,next)=>getByIdOrSlug(req,res,'gallery_items','*').catch(next))
router.post('/', requireLeader, async(req,res,next)=>{ try{ const slug = await makeUniqueSlug('gallery_items', req.body.title, req.body.slug); await insertRow(req,res,'gallery_items',{...req.body,slug,uploaded_by:req.authUser?.id}) }catch(e){next(e)} })
router.post('/upload', requireAuth, upload.single('file'), async(req,res,next)=>{ try{ if(!req.file) return res.status(400).json({error:'No file uploaded'}); const path=`gallery/${Date.now()}-${req.file.originalname}`; const {error}=await supabase.storage.from('gallery').upload(path, req.file.buffer,{contentType:req.file.mimetype,upsert:false}); if(error) throw error; const {data}=supabase.storage.from('gallery').getPublicUrl(path); res.status(201).json({data:{path,publicUrl:data.publicUrl}}) }catch(e){next(e)} })
router.put('/:id', requireLeader, (req,res,next)=>updateRow(req,res,'gallery_items',req.body).catch(next))
router.delete('/:id', requireLeader, (req,res,next)=>deleteRow(req,res,'gallery_items').catch(next))
export default router
