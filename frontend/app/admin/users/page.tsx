"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, Search, ShieldCheck, UserCheck } from 'lucide-react'

export default function UsersAdminPage() {
  const { profile, accessToken } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = accessToken || undefined
  const isAdmin = profile?.role === 'admin'

  const load = async () => {
    setLoading(true); setError('')
    try { const res = await api.list(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, token); setRows(res.data || []) }
    catch (err: any) { setError(err.message || 'Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (token) load() }, [token])

  const updateRole = async (id: string, role: string) => {
    if (!isAdmin) return
    try { await api.updateUser(id, { role }, token); await load() }
    catch (err: any) { setError(err.message || 'Failed to update role') }
  }

  return <main className="p-5 sm:p-6 lg:p-8">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-black uppercase tracking-[0.25em] text-purple-500">PCM Management</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Users & Roles</h1><p className="mt-2 max-w-2xl text-slate-500">Promote trusted members to leader or admin while keeping normal signups as members.</p></div>
      <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700 ring-1 ring-purple-100"><ShieldCheck className="mr-2 inline h-4 w-4" />{isAdmin ? 'Full role control' : 'View only access'}</div>
    </div>
    <div className="mb-6 flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or email" className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-slate-900 focus-visible:ring-purple-100"/></div><Button onClick={load} variant="outline" className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button></div>
    {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    {!isAdmin && <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">You can view users as a leader, but only admins can change roles.</div>}
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><p className="font-black text-slate-900">{rows.length} users</p><p className="text-xs font-medium text-slate-400">Account list from Supabase Auth profiles</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-6 py-4 font-black">User</th><th className="px-6 py-4 font-black">Email</th><th className="px-6 py-4 font-black">Role</th><th className="px-6 py-4 text-right font-black">Change role</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading users...</td></tr> : rows.map(user => <tr key={user.id} className="hover:bg-purple-50/40"><td className="px-6 py-4 text-slate-900"><div className="flex items-center gap-3">{user.avatar_url ? <img src={user.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100" /> : <div className="grid h-11 w-11 place-items-center rounded-full bg-purple-50 text-purple-600"><UserCheck className="h-5 w-5"/></div>}<b>{user.name}</b></div></td><td className="px-6 py-4 text-slate-500">{user.email}</td><td className="px-6 py-4"><span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-bold capitalize text-purple-700 ring-1 ring-purple-100">{user.role}</span></td><td className="px-6 py-4 text-right">{isAdmin ? <select value={user.role} onChange={e=>updateRole(user.id, e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"><option value="student">student</option><option value="leader">leader</option><option value="admin">admin</option></select> : <span className="text-xs font-semibold text-slate-400">Admin only</span>}</td></tr>)}</tbody></table></div></section>
  </main>
}
