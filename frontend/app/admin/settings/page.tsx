"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, Settings } from 'lucide-react'

const fields: any[] = [
  ['site_name','Site Name'], ['contact_email','Contact Email'], ['helpline','Helpline'], ['emergency_phone','Emergency Phone'], ['location','Location'], ['office_hours','Office Hours'], ['facebook_url','Facebook URL'], ['instagram_url','Instagram URL'], ['whatsapp_url','WhatsApp URL'],
  ['homepage_eyebrow','Homepage Eyebrow'], ['homepage_title','Homepage Hero Title'], ['homepage_subtitle','Homepage Hero Subtitle'], ['hero_slider_images','Hero Slider Images, comma-separated URLs'],
  ['feature_1_title','Feature 1 Title'], ['feature_1_description','Feature 1 Description'], ['feature_2_title','Feature 2 Title'], ['feature_2_description','Feature 2 Description'],
  ['feature_3_title','Feature 3 Title'], ['feature_3_description','Feature 3 Description'], ['feature_4_title','Feature 4 Title'], ['feature_4_description','Feature 4 Description'],
  ['faq_1_question','FAQ 1 Question'], ['faq_1_answer','FAQ 1 Answer'], ['faq_2_question','FAQ 2 Question'], ['faq_2_answer','FAQ 2 Answer'],
  ['faq_3_question','FAQ 3 Question'], ['faq_3_answer','FAQ 3 Answer'], ['faq_4_question','FAQ 4 Question'], ['faq_4_answer','FAQ 4 Answer'],
  ['events_page_title','Events Page Title'], ['events_page_description','Events Page Description'],
  ['news_page_title','News Page Title'], ['news_page_description','News Page Description'],
  ['resources_page_title','Resources Page Title'], ['resources_page_description','Resources Page Description']
]

export default function SettingsAdminPage() {
  const { accessToken } = useAuth()
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const token = accessToken || undefined
  useEffect(()=>{ if (!token) return; (async()=>{ try { const res=await api.settings(token); setSettings(res.data?.settings || {}) } catch(err:any){ setError(err.message || 'Failed to load settings') } finally { setLoading(false) } })() }, [token])
  const save = async (e: React.FormEvent) => { e.preventDefault(); setSuccess(''); setError(''); try { await api.updateSettings({ settings }, token); setSuccess('Settings saved successfully.') } catch(err:any) { setError(err.message || 'Failed to save settings') } }
  return <main className="p-5 sm:p-6 lg:p-8">
    <div className="mb-6"><p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">PCM Management</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Site Settings</h1><p className="mt-2 max-w-2xl text-slate-500">Control official website details, footer contact information, homepage text, page headings, and giving instructions.</p></div>
    {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}{success && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{success}</div>}
    <form onSubmit={save} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Settings className="h-6 w-6"/></div><div><h2 className="text-xl font-black text-slate-900">Website content and organization details</h2><p className="text-sm text-slate-500">These values control the public website content, footer details, and homepage sections.</p></div></div>{loading ? <p className="text-slate-500">Loading...</p> : <div className="grid gap-4 md:grid-cols-2">{fields.map(([key,label]) => <label key={key}><span className="mb-2 block text-sm text-slate-700 font-bold">{label}</span><Input value={settings[key] || ''} onChange={e=>setSettings(prev=>({...prev,[key]:e.target.value}))} className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-emerald-100"/></label>)}<label className="md:col-span-2"><span className="mb-2 block text-sm text-slate-700 font-bold">Footer Note</span><Textarea value={settings.footer_note || ''} onChange={e=>setSettings(prev=>({...prev,footer_note:e.target.value}))} className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-emerald-100"/></label><label className="md:col-span-2"><span className="mb-2 block text-sm text-slate-700 font-bold">Giving Instructions</span><Textarea value={settings.giving_instructions || ''} onChange={e=>setSettings(prev=>({...prev,giving_instructions:e.target.value}))} className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-emerald-100"/></label></div>}<div className="mt-6 flex justify-end"><Button className="rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-800"><Save className="mr-2 h-4 w-4"/>Save Settings</Button></div></form>
  </main>
}
