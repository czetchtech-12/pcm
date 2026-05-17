import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase.js'
import { insertRow, updateRow, listTable } from '../utils/crud.js'
import { requireLeader, requireAdmin } from '../middleware/auth.js'
import { notifyAdmins, sendDonorReceipt } from '../utils/mailer.js'
import { publicPostLimiter, strictPublicPostLimiter } from '../middleware/rateLimit.js'

const router = Router()

const nullableString = (max = 500) => z.string().trim().max(max).optional().nullable()
const email = z.string().trim().email().max(160)
const phone = z.string().trim().max(40).optional().nullable().or(z.literal(''))
const donationProvider = z.enum(['manual', 'mtn_mobile_money', 'airtel_money', 'zamtel_money', 'bank_transfer', 'flutterwave', 'paypal', 'dpo_pay'])
const donationType = z.enum(['monthly', 'one_time', 'event_sponsorship', 'student_support'])
const donationStatus = z.enum(['pending', 'completed', 'failed'])

const prayerSchema = z.object({
  name: nullableString(120),
  email: z.string().trim().email().max(160).optional().nullable().or(z.literal('')),
  phone,
  category: nullableString(80).default('general'),
  request: z.string().trim().min(5).max(3000).optional(),
  message: z.string().trim().min(5).max(3000).optional(),
  is_anonymous: z.boolean().optional().default(false)
}).refine(v => v.request || v.message, { message: 'Prayer request message is required' })

const counselingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: email.optional().nullable().or(z.literal('')),
  phone,
  service_type: z.enum(['personal', 'relationship', 'academic', 'crisis']).default('personal'),
  preferred_contact: nullableString(50),
  preferred_counselor: nullableString(120),
  message: z.string().trim().min(5).max(3000),
  urgency: nullableString(40)
})

const donationSchema = z.object({
  name: nullableString(120),
  donor_name: nullableString(120),
  email: z.string().trim().email().max(160).optional().nullable().or(z.literal('')),
  donor_email: z.string().trim().email().max(160).optional().nullable().or(z.literal('')),
  phone,
  donor_phone: phone,
  amount: z.coerce.number({ invalid_type_error: 'Amount is required' }).positive('Amount must be greater than zero').max(100000000),
  currency: z.string().trim().max(10).optional().default('ZMW'),
  purpose: z.string().trim().min(2).max(120).default('General giving'),
  type: donationType.default('one_time'),
  payment_provider: donationProvider.optional(),
  method: z.string().trim().max(80).optional().nullable(),
  transaction_reference: nullableString(160),
  is_anonymous: z.boolean().optional().default(false),
  status: donationStatus.optional()
})

const donationUpdateSchema = z.object({
  status: donationStatus.optional(),
  transaction_reference: nullableString(160),
  admin_note: nullableString(1000),
  payment_provider: donationProvider.optional(),
  purpose: z.string().trim().min(2).max(120).optional(),
  type: donationType.optional()
}).refine(v => Object.keys(v).length > 0, { message: 'No fields to update' })

const newsletterSchema = z.object({
  email,
  name: nullableString(120)
})

const involvementSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  phone,
  area_of_interest: z.string().trim().min(2).max(120),
  availability: nullableString(120),
  message: nullableString(2000)
})

function normalizeDonationProvider(body) {
  const raw = String(body.payment_provider || body.method || 'manual').toLowerCase().trim()
  const map = {
    'mtn mobile money': 'mtn_mobile_money',
    'mtn money': 'mtn_mobile_money',
    mtn: 'mtn_mobile_money',
    'airtel money': 'airtel_money',
    airtel: 'airtel_money',
    'zamtel money': 'zamtel_money',
    zamtel: 'zamtel_money',
    'bank transfer': 'bank_transfer',
    bank: 'bank_transfer',
    flutterwave: 'flutterwave',
    paypal: 'paypal',
    dpo: 'dpo_pay',
    'dpo pay': 'dpo_pay',
    manual: 'manual'
  }
  return map[raw] || 'manual'
}

router.post('/prayer-requests', strictPublicPostLimiter, async (req,res,next)=>{ try{ const parsed = prayerSchema.parse(req.body); const payload = { ...parsed, category: parsed.category || 'general', request: parsed.request || parsed.message, status:'active' }; await notifyAdmins('New prayer request', `Category: ${payload.category}\n${payload.request || ''}`); await insertRow(req,res,'prayer_requests',payload) }catch(e){next(e)} })
router.get('/prayer-requests', requireLeader, (req,res,next)=>listTable(req,res,'prayer_requests','*',['status','category']).catch(next))
router.put('/prayer-requests/:id', requireLeader, (req,res,next)=>updateRow(req,res,'prayer_requests',req.body).catch(next))

router.post('/counseling-requests', strictPublicPostLimiter, async (req,res,next)=>{ try{ const parsed = counselingSchema.parse(req.body); await notifyAdmins('New counseling request', `Service: ${parsed.service_type || 'unspecified'}\nName: ${parsed.name || 'Anonymous'}`); await insertRow(req,res,'counseling_requests',{...parsed,status:'pending'}) }catch(e){next(e)} })
router.get('/counseling-requests', requireLeader, (req,res,next)=>listTable(req,res,'counseling_requests','*',['status','service_type']).catch(next))
router.put('/counseling-requests/:id', requireLeader, (req,res,next)=>updateRow(req,res,'counseling_requests',req.body).catch(next))

router.post('/donations', publicPostLimiter, async (req,res,next)=>{ 
  try{ 
    const body = donationSchema.parse({ ...req.body, payment_provider: normalizeDonationProvider(req.body) })
    const payload={
      donor_name: body.donor_name || body.name || null,
      donor_email: body.donor_email || body.email || null,
      donor_phone: body.donor_phone || body.phone || null,
      amount: body.amount,
      currency: body.currency || 'ZMW',
      purpose: body.purpose || 'General giving',
      type: body.type || 'one_time',
      payment_provider: body.payment_provider || 'manual',
      transaction_reference: body.transaction_reference || null,
      is_anonymous: Boolean(body.is_anonymous),
      status:'pending'
    }
    await notifyAdmins('New giving record awaiting verification', `Method: ${payload.payment_provider}\nAmount: ${payload.currency} ${payload.amount}\nPurpose: ${payload.purpose}\nReference: ${payload.transaction_reference || 'Not provided'}`)
    await insertRow(req,res,'donations',payload)
  }catch(e){next(e)} 
})
router.get('/donations', requireAdmin, (req,res,next)=>listTable(req,res,'donations','*',['status','type','purpose','payment_provider']).catch(next))
router.put('/donations/:id', requireAdmin, async (req,res,next)=>{
  try {
    const parsed = donationUpdateSchema.parse(req.body)
    const payload = { ...parsed }
    if (parsed.status === 'completed') {
      payload.verified_at = new Date().toISOString()
      payload.verified_by = req.authUser?.id || null
    }
    const { data, error } = await supabase.from('donations').update(payload).eq('id', req.params.id).select().single()
    if (error) throw error
    if (parsed.status === 'completed' && data?.donor_email) {
      await sendDonorReceipt(data).catch(err => console.warn('Donation receipt email was not sent:', err.message))
    }
    res.json({ data })
  } catch (e) { next(e) }
})

router.post('/newsletter', strictPublicPostLimiter, (req,res,next)=>{ try{ const parsed = newsletterSchema.parse(req.body); return insertRow(req,res,'newsletter_subscribers',{email:parsed.email,name:parsed.name,status:'active'}).catch(next) }catch(e){next(e)} })

router.post('/involvement-requests', publicPostLimiter, async (req,res,next)=>{ try{ const parsed = involvementSchema.parse(req.body); await notifyAdmins('New involvement request', `Area: ${parsed.area_of_interest || 'unspecified'}\nName: ${parsed.name || ''}\nEmail: ${parsed.email || ''}`); await insertRow(req,res,'involvement_requests',{...parsed,status:'pending'}) }catch(e){next(e)} })
router.get('/involvement-requests', requireLeader, (req,res,next)=>listTable(req,res,'involvement_requests','*',['status','area_of_interest']).catch(next))
router.put('/involvement-requests/:id', requireLeader, (req,res,next)=>updateRow(req,res,'involvement_requests',req.body).catch(next))

export default router
