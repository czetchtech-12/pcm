import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const DEFAULT_SETTINGS = {
  site_name: 'CBU SDA Public Campus Ministries',
  contact_email: 'czetchtech@gmail.com',
  helpline: '0760102833',
  emergency_phone: '0776240927',
  location: 'CBU/KITWE/ZAMBIA',
  footer_note: 'A SIH project by Ginno Tech | Founder : Innocent Sichinga',
  facebook_url: '',
  instagram_url: '',
  whatsapp_url: '',
  office_hours: 'Mon–Fri, 08:00–17:00',
  giving_instructions: 'Use bank transfer or mobile money, then submit the giving record for confirmation.',
  homepage_eyebrow: 'Faith • Community • Service',
  homepage_title: 'Find Your Purpose.',
  homepage_subtitle: 'Join CBU SDA Public Campus Ministries for spiritual growth, community outreach, biblical studies, and meaningful fellowship with fellow believers.',
  hero_slider_images: '/Slider/KCM_0549.jpg,/Slider/KCM_0799.jpg,/Slider/KCM_0822.jpg',
  feature_1_title: 'Biblical Teaching',
  feature_1_description: 'Scripture-based studies led by experienced ministry leaders.',
  feature_2_title: 'Welcoming Community',
  feature_2_description: 'A Christ-centered environment for students of all backgrounds.',
  feature_3_title: 'Free Ministry Programs',
  feature_3_description: 'All worship services and Bible studies are free to attend.',
  feature_4_title: 'Campus Outreach',
  feature_4_description: `Share God's love through service and evangelism.`,
  faq_1_question: 'What ministries does CBU SDA offer?',
  faq_1_answer: 'We offer Bible studies, worship services, prayer groups, and evangelism training.',
  faq_2_question: 'How can I join the ministry?',
  faq_2_answer: 'Students can join by attending our weekly meetings or contacting our ministry team.',
  faq_3_question: 'Do you offer spiritual counseling?',
  faq_3_answer: 'Yes, we provide pastoral care and spiritual guidance for all students.',
  faq_4_question: 'How do I get baptized?',
  faq_4_answer: 'Contact our ministry leaders to discuss baptism and begin Bible study preparation.',
  events_page_title: 'Events',
  events_page_description: 'Upcoming services, outreach activities, Bible studies, fellowships, and special programs. Open an event to register.',
  news_page_title: 'News & Testimonies',
  news_page_description: 'Read published ministry updates, testimonies, announcements, and campus news from the admin-managed backend.',
  resources_page_title: 'Resources',
  resources_page_description: 'Read and download Bible studies, sermons, devotionals, and ministry manuals.'
}


router.get('/public', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (error && error.code !== '42P01') throw error
    res.json({ data: data || { id: 1, settings: DEFAULT_SETTINGS } })
  } catch (error) { next(error) }
})

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (error && error.code !== '42P01') throw error
    res.json({ data: data || { id: 1, settings: DEFAULT_SETTINGS } })
  } catch (error) { next(error) }
})

router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const payload = { id: 1, settings: { ...DEFAULT_SETTINGS, ...(req.body.settings || req.body) }, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' }).select().single()
    if (error) throw error
    res.json({ data })
  } catch (error) { next(error) }
})

export default router
