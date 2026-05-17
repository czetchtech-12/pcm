"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, RefreshCw, Database } from 'lucide-react'

export default function AnalyticsAdminPage() {
  const { accessToken } = useAuth()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [backup, setBackup] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const token = accessToken || undefined
  const load = async () => { setLoading(true); setError(''); try { const res = await api.stats(token); setStats(res.data || {}) } catch (err:any) { setError(err.message || 'Failed to load analytics') } finally { setLoading(false) } }
  const downloadBackup = async () => { try { const res = await api.backup(token); setBackup(res.data); const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pcm-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url) } catch (err:any) { setError(err.message || 'Failed to export backup') } }
  useEffect(()=>{ if (token) load() }, [token])
  const entries = Object.entries(stats)
  return <main className="p-5 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-purple-500">PCM Management</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Analytics & Backup</h1><p className="mt-2 max-w-2xl text-slate-500">Monitor live table totals and export a JSON backup for safety.</p></div><div className="flex gap-2"><Button onClick={load} variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button><Button onClick={downloadBackup} className="rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700"><Download className="mr-2 h-4 w-4"/>Export Backup</Button></div></div>
    {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{loading ? <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Loading...</div> : entries.map(([key,value], index) => <div key={key} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${index % 3 === 0 ? 'bg-purple-50 text-purple-600' : index % 3 === 1 ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}><BarChart3 className="h-6 w-6"/></div><p className="mt-5 text-4xl font-black text-slate-900">{value}</p><p className="mt-1 text-sm font-semibold capitalize text-slate-500">{key.replaceAll('_',' ')}</p></div>)}</section>
    {backup && <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><Database className="h-7 w-7 text-purple-600"/><h2 className="mt-4 text-xl font-black text-slate-900">Latest backup generated</h2><p className="mt-2 text-sm text-slate-500">Exported at {backup.exported_at}. Keep this file safely.</p></section>}
  </main>
}
