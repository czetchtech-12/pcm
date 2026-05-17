"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/components/auth/AuthProvider'
import { BarChart3, Calendar, FileText, Heart, HandHeart, MessageCircle, Newspaper, Settings, ShieldCheck, Users, ArrowUpRight, BookOpen, Image as ImageIcon } from 'lucide-react'

const cards = [
  { key: 'posts', label: 'Content', href: '/admin/content', icon: Newspaper, gradient: 'from-amber-500 to-orange-500', note: 'Published articles' },
  { key: 'events', label: 'Events', href: '/admin/events', icon: Calendar, gradient: 'from-emerald-500 to-teal-500', note: 'Upcoming programs' },
  { key: 'resources', label: 'Resources', href: '/admin/resources', icon: BookOpen, gradient: 'from-lime-500 to-emerald-600', note: 'Study materials' },
  { key: 'users', label: 'Members', href: '/admin/users', icon: Users, gradient: 'from-slate-700 to-emerald-800', note: 'Registered accounts' },
]

const ministryCards = [
  { key: 'gallery_items', label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { key: 'prayer_requests', label: 'Prayer Requests', href: '/admin/prayers', icon: Heart },
  { key: 'counseling_requests', label: 'Counseling', href: '/admin/counseling', icon: MessageCircle },
  { key: 'involvement_requests', label: 'Volunteers', href: '/admin/volunteers', icon: HandHeart },
]

const quickActions = [
  ['Publish content','Create news, testimonies, and announcements','/admin/content'],
  ['Create event','Add events and manage registrations','/admin/events'],
  ['Review requests','Respond to prayer, counseling, and involvement forms','/admin/prayers'],
  ['Website settings','Update official contact details and homepage text','/admin/settings'],
]

const chartValues = [35, 68, 42, 84, 57, 91, 64, 76]

export default function AdminDashboard() {
  const { profile, accessToken } = useAuth()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const token = accessToken || undefined
  useEffect(()=>{ if (!token) return; (async()=>{ try { const res=await api.stats(token); setStats(res.data || {}) } catch(err:any){ setError(err.message || 'Could not load dashboard stats') } })() }, [token])

  const totalRecords = useMemo(() => Object.values(stats).reduce((sum, val) => sum + (Number(val) || 0), 0), [stats])

  return <main className="p-5 sm:p-6 lg:p-8">
    <section className="mb-6 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b1815] via-emerald-800 to-amber-600 p-7 text-white shadow-xl shadow-emerald-950/40">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <p className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold ring-1 ring-white/25"><ShieldCheck className="mr-2 h-4 w-4"/>Production control center</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight lg:text-5xl">Welcome back, {profile?.name || 'Admin'}.</h1>
            <p className="mt-3 max-w-2xl text-white/80">Manage PCM content, events, resources, members, requests, announcements, and site settings from one realistic workspace.</p>
          </div>
          <Link href="/admin/analytics" className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm hover:bg-amber-50"><BarChart3 className="mr-2 h-4 w-4"/>View Analytics</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/20"><p className="text-sm text-white/70">Total records</p><p className="mt-2 text-3xl font-black">{totalRecords || '—'}</p></div>
          <div className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/20"><p className="text-sm text-white/70">Admin role</p><p className="mt-2 text-3xl font-black capitalize">{profile?.role}</p></div>
          <div className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/20"><p className="text-sm text-white/70">Mode</p><p className="mt-2 text-3xl font-black">Live</p></div>
        </div>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900">Activity overview</h2><p className="text-sm text-slate-500">Visual summary of recent activity</p></div><span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-emerald-800">Today</span></div>
        <div className="mt-8 flex h-40 items-end gap-3 border-b border-slate-100 pb-2">
          {chartValues.map((value, index) => <div key={index} className="flex flex-1 items-end justify-center rounded-t-2xl bg-gradient-to-t from-emerald-600 to-amber-400" style={{ height: `${value}%` }} />)}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      </div>
    </section>

    {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({key,label,href,icon: Icon,gradient,note}: any) => <Link key={key} href={href} className={`group overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}>
        <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/25"><Icon className="h-6 w-6"/></div><ArrowUpRight className="h-5 w-5 opacity-70 transition group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
        <p className="mt-7 text-sm font-semibold text-white/75">{label}</p><p className="mt-1 text-4xl font-black">{stats[key] ?? '—'}</p><p className="mt-4 text-sm text-white/75">{note}</p>
      </Link>)}
    </section>

    <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-slate-900">Ministry operations</h2><p className="mt-1 text-sm text-slate-500">Important admin areas that need regular review.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">
        {ministryCards.map(({key,label,href,icon: Icon}: any) => <Link key={key} href={href} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-purple-100 hover:bg-amber-50"><span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm"><Icon className="h-5 w-5"/></span><span><b className="block text-slate-900">{label}</b><small className="text-slate-500">{stats[key] ?? '—'} records</small></span></span><ArrowUpRight className="h-4 w-4 text-slate-400"/></Link>)}
      </div></div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><Settings className="h-7 w-7 text-emerald-600"/><h2 className="mt-4 text-xl font-black text-slate-900">Quick actions</h2><div className="mt-4 space-y-3">{quickActions.map(([title,desc,href]) => <Link key={href} href={href} className="block rounded-2xl border border-slate-100 p-4 transition hover:border-purple-100 hover:bg-amber-50"><p className="font-bold text-slate-900">{title}</p><p className="mt-1 text-sm text-slate-500">{desc}</p></Link>)}</div></div>
    </section>
  </main>
}
