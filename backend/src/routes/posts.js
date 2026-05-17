import { Router } from 'express'
import { z } from 'zod'
import { listTable, getByIdOrSlug, insertRow, updateRow, deleteRow, makeUniqueSlug } from '../utils/crud.js'
import { requireLeader } from '../middleware/auth.js'
const router = Router()
const postCategories = ['testimony', 'news', 'announcement', 'ministry']
const postStatuses = ['draft', 'published', 'archived']
const bodySchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  category: z.enum(postCategories).default('news'),
  image_url: z.string().optional().nullable(),
  status: z.enum(postStatuses).default('published'),
  author_id: z.string().uuid().optional().nullable(),
  published_at: z.string().optional().nullable()
}).passthrough()
router.get('/', (req,res,next)=>listTable(req,res,'posts','*,author:users(name,email)',['category','status']).catch(next))
router.get('/:id', (req,res,next)=>getByIdOrSlug(req,res,'posts','*,author:users(name,email)').catch(next))
router.post('/', requireLeader, async (req,res,next)=>{ try{ const p=bodySchema.parse(req.body); const slug = await makeUniqueSlug('posts', p.title, req.body.slug); await insertRow(req,res,'posts',{...p, slug, excerpt:p.excerpt||p.content.slice(0,160), author_id:p.author_id||req.authUser?.id}) }catch(e){next(e)} })
router.put('/:id', requireLeader, async(req,res,next)=>{ try{ const p=bodySchema.partial().parse(req.body); if(p.title&&!req.body.slug) p.slug=await makeUniqueSlug('posts', p.title); await updateRow(req,res,'posts',p) }catch(e){next(e)} })
router.delete('/:id', requireLeader, (req,res,next)=>deleteRow(req,res,'posts').catch(next))
export default router
