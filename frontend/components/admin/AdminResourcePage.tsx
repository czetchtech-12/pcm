"use client"

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Pencil, Trash2, RefreshCw, Save, X, Download, Filter, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react'

export type Field = {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'select' | 'url' | 'email' | 'tel' | 'image' | 'file'
  options?: string[]
  required?: boolean
  placeholder?: string
  defaultValue?: string | number
  uploadBucket?: string
  uploadFolder?: string
}

type Props = {
  title: string
  description: string
  endpoint: string
  fields: Field[]
  columns: string[]
  filters?: { name: string; label: string; options: string[] }[]
  readOnlyCreate?: boolean
  allowDelete?: boolean
  exportUrl?: string
}

function valueForInput(value: any, type?: Field['type']) {
  if (!value) return ''
  if (type === 'date') return String(value).slice(0, 10)
  if (type === 'datetime-local') return String(value).slice(0, 16)
  return String(value)
}

function nice(value: any) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function badge(value: any) {
  const text = nice(value)
  const lowered = text.toLowerCase()
  const color = lowered.includes('published') || lowered.includes('completed') || lowered.includes('approved') || lowered.includes('active') ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : lowered.includes('pending') || lowered.includes('draft') ? 'bg-amber-50 text-amber-700 ring-amber-100' : lowered.includes('archived') || lowered.includes('failed') || lowered.includes('cancelled') ? 'bg-rose-50 text-rose-700 ring-rose-100' : 'bg-slate-50 text-slate-700 ring-slate-100'
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${color}`}>{text.replaceAll('_',' ')}</span>
}

export function AdminResourcePage({ title, description, endpoint, fields, columns, filters = [], readOnlyCreate = false, allowDelete = true, exportUrl }: Props) {
  const { profile, accessToken } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 50
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})

  const token = accessToken || undefined
  const canDelete = allowDelete && profile?.role === 'admin'

  const load = async () => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      params.set('limit', String(pageSize))
      params.set('offset', String(page * pageSize))
      for (const [key, value] of Object.entries(filterValues)) if (value) params.set(key, value)
      const suffix = params.toString() ? `?${params}` : ''
      const res = await api.list(`${endpoint}${suffix}`, token)
      setRows(res.data || [])
      setCount(res.count || (res.data || []).length)
    } catch (err: any) { setError(err.message || 'Failed to load data') }
    finally { setLoading(false) }
  }

  useEffect(() => { const t = setTimeout(() => { setPage(0); setDebouncedQuery(query) }, 300); return () => clearTimeout(t) }, [query])
  useEffect(() => { setPage(0) }, [JSON.stringify(filterValues)])
  useEffect(() => { if (token) load() }, [token, debouncedQuery, JSON.stringify(filterValues), page])

  const startNew = () => {
    const initial: Record<string, any> = {}
    fields.forEach(f => initial[f.name] = f.defaultValue ?? '')
    setForm(initial)
    setEditing({ id: null })
  }

  const startEdit = (row: any) => {
    const initial: Record<string, any> = {}
    fields.forEach(f => initial[f.name] = valueForInput(row[f.name], f.type))
    setForm(initial)
    setEditing(row)
  }

  const closeForm = () => { setEditing(null); setForm({}); setError('') }

  const uploadFile = async (field: Field, file: File) => {
    setSaving(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', field.uploadBucket || (field.type === 'image' ? 'images' : 'files'))
      fd.append('folder', field.uploadFolder || field.name.replace('_url', '').replace('_file', '') || 'uploads')
      const res = await api.upload(fd, token)
      setForm(prev => ({ ...prev, [field.name]: res.data.storageRef || res.data.publicUrl }))
    } catch (err: any) { setError(err.message || 'Failed to upload file') }
    finally { setSaving(false) }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload: Record<string, any> = {}
      fields.forEach((field) => {
        const raw = form[field.name]
        if (raw === '' || raw === undefined) return
        payload[field.name] = field.type === 'number' ? Number(raw) : raw
      })
      if (editing?.id) await api.update(`${endpoint}/${editing.id}`, payload, token)
      else await api.create(endpoint, payload, token)
      closeForm(); await load()
    } catch (err: any) { setError(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const remove = async (row: any) => {
    if (!confirm(`Delete ${row.title || row.name || row.email || 'this item'}? This cannot be undone.`)) return
    setSaving(true); setError('')
    try { await api.remove(`${endpoint}/${row.id}`, token); await load() }
    catch (err: any) { setError(err.message || 'Failed to delete') }
    finally { setSaving(false) }
  }

  const filteredTitle = useMemo(() => count === 1 ? '1 record' : `${count} records`, [count])
  const totalPages = Math.max(1, Math.ceil(count / pageSize))

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">PCM Management</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportUrl && <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"><a href={exportUrl}><Download className="mr-2 h-4 w-4"/>Export</a></Button>}
          {!readOnlyCreate && <Button onClick={startNew} className="rounded-2xl bg-emerald-700 px-5 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-800"><Plus className="mr-2 h-4 w-4"/>New</Button>}
        </div>
      </div>

      <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-100" /></div>
          {filters.map((filter) => <div key={filter.name} className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><select value={filterValues[filter.name] || ''} onChange={e=>setFilterValues(prev=>({...prev,[filter.name]:e.target.value}))} className="h-12 min-w-[170px] rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
            <option value="">All {filter.label}</option>{filter.options.map(option => <option key={option} value={option}>{option.replaceAll('_',' ')}</option>)}
          </select></div>)}
          <Button onClick={() => load()} variant="outline" className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw className="mr-2 h-4 w-4"/>Refresh</Button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      {editing && (
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-lg shadow-emerald-100/40">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-amber-50 px-6 py-5"><div><h2 className="text-xl font-black text-slate-900">{editing.id ? 'Edit record' : 'Create record'}</h2><p className="text-sm text-slate-500">Fill the details below and save changes.</p></div><button onClick={closeForm} className="rounded-full bg-white p-2 text-slate-500 shadow-sm hover:text-slate-900"><X className="h-4 w-4"/></button></div>
          <form onSubmit={submit} className="grid gap-4 p-6 md:grid-cols-2">
            {fields.map((field) => <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <span className="mb-2 block text-sm font-bold text-slate-700">{field.label}{field.required && <span className="text-red-500"> *</span>}</span>
              {field.type === 'textarea' ? <Textarea required={field.required} value={form[field.name] || ''} onChange={e=>setForm(prev=>({...prev,[field.name]:e.target.value}))} placeholder={field.placeholder} className="min-h-28 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-100" /> : field.type === 'select' ? <select required={field.required} value={form[field.name] || ''} onChange={e=>setForm(prev=>({...prev,[field.name]:e.target.value}))} className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
                <option value="">Select {field.label}</option>{(field.options||[]).map(option => <option key={option} value={option}>{option.replaceAll('_',' ')}</option>)}
              </select> : (field.type === 'image' || field.type === 'file') ? <div className="space-y-2">
                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4"><UploadCloud className="mb-2 h-6 w-6 text-emerald-700"/><Input required={field.required && !form[field.name]} type="file" accept={field.type === 'image' ? 'image/*' : undefined} onChange={e=>{ const file=e.target.files?.[0]; if(file) uploadFile(field, file) }} className="border-0 bg-white text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white" /></div>
                {form[field.name] ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">Uploaded file saved: <a className="break-all font-semibold text-emerald-700 underline" href={form[field.name]} target="_blank" rel="noreferrer">{form[field.name]}</a></div> : <p className="text-xs text-slate-400">Upload a file. The storage reference will be saved automatically.</p>}
              </div> : <Input required={field.required} type={field.type || 'text'} value={form[field.name] || ''} onChange={e=>setForm(prev=>({...prev,[field.name]:e.target.value}))} placeholder={field.placeholder} className="h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-amber-100" />}
            </label>)}
            <div className="md:col-span-2 flex justify-end gap-2"><Button type="button" onClick={closeForm} variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50">Cancel</Button><Button disabled={saving} className="rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800"><Save className="mr-2 h-4 w-4"/>{saving ? 'Saving...' : 'Save'}</Button></div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="font-black text-slate-900">{filteredTitle}</p><p className="text-xs font-medium text-slate-400">Live records from the database</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Page {page + 1}</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>{columns.map(c=><th key={c} className="px-6 py-4 font-black capitalize tracking-wide">{c.replaceAll('_',' ')}</th>)}<th className="px-6 py-4 text-right font-black">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={columns.length+1} className="px-6 py-12 text-center text-slate-500">Loading records...</td></tr> : rows.length === 0 ? <tr><td colSpan={columns.length+1} className="px-6 py-12 text-center text-slate-500">No records yet.</td></tr> : rows.map(row => <tr key={row.id} className="transition hover:bg-amber-50/50">{columns.map(c=><td key={c} className="max-w-[280px] truncate px-6 py-4 text-slate-700">{['status','category','type','priority','payment_provider','service_type'].includes(c) ? badge(row[c]) : nice(row[c])}</td>)}<td className="px-6 py-4"><div className="flex justify-end gap-2"><Button size="sm" onClick={()=>startEdit(row)} variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="h-4 w-4"/></Button>{canDelete && <Button size="sm" onClick={()=>remove(row)} variant="outline" className="rounded-xl border-red-100 bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4"/></Button>}</div></td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500"><span>Page {page + 1} of {totalPages}</span><div className="flex gap-2"><Button type="button" disabled={page === 0 || loading} onClick={() => setPage(p => Math.max(0, p - 1))} variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="mr-1 h-4 w-4"/>Previous</Button><Button type="button" disabled={page + 1 >= totalPages || loading} onClick={() => setPage(p => p + 1)} variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40">Next<ChevronRight className="ml-1 h-4 w-4"/></Button></div></div>
      </section>
    </main>
  )
}
