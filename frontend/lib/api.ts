import { supabase } from '@/lib/supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

type ApiOptions = RequestInit & { token?: string }

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const hasBody = options.body !== undefined && options.body !== null
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  if (hasBody && !isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  let token = options.token
  if (!token && typeof window !== 'undefined') {
    const { data: { session } } = await supabase.auth.getSession()
    token = session?.access_token || undefined
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' })
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}))
    throw new Error(payload.error || payload.message || `API error ${res.status}`)
  }
  if (res.status === 204) return {} as T
  return res.json()
}

export const api = {

  list: (path: string, token?: string) => apiFetch<{data:any[],count?:number}>(path, { token }),
  get: (path: string, token?: string) => apiFetch<{data:any}>(path, { token }),
  create: (path: string, body: any, token?: string) => apiFetch(path, { method: 'POST', body: JSON.stringify(body), token }),
  update: (path: string, body: any, token?: string) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body), token }),
  remove: (path: string, token?: string) => apiFetch(path, { method: 'DELETE', token }),
  me: (token?: string) => apiFetch<{data:any}>('/users/me', { token }),
  updateMe: (body: any, token?: string) => apiFetch<{data:any}>('/users/me', { method: 'PUT', body: JSON.stringify(body), token }),
  myRegistrations: (token?: string) => apiFetch<{data:any[]}>('/users/me/registrations', { token }),
  users: (token?: string) => apiFetch<{data:any[],count?:number}>('/users', { token }),
  updateUser: (id: string, body: any, token?: string) => apiFetch<{data:any}>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body), token }),
  publicSettings: () => apiFetch<{data:any}>('/settings/public'),
  settings: (token?: string) => apiFetch<{data:any}>('/settings', { token }),
  updateSettings: (body: any, token?: string) => apiFetch<{data:any}>('/settings', { method: 'PUT', body: JSON.stringify(body), token }),
  stats: (token?: string) => apiFetch<{data:any}>('/dashboard/stats', { token }),
  backup: (token?: string) => apiFetch<{data:any}>('/dashboard/backup', { token }),
  analytics: (body: any) => apiFetch('/analytics/track', { method: 'POST', body: JSON.stringify(body) }),
  search: (q: string) => apiFetch<{data:any[]}>(`/search?q=${encodeURIComponent(q)}`),
  posts: () => apiFetch<{data:any[]}>('/posts?status=published'),
  post: (id: string) => apiFetch<{data:any}>(`/posts/${id}`),
  createPost: (body: any, token?: string) => apiFetch('/posts', { method: 'POST', body: JSON.stringify(body), token }),
  updatePost: (id: string, body: any, token?: string) => apiFetch(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body), token }),
  deletePost: (id: string, token?: string) => apiFetch(`/posts/${id}`, { method: 'DELETE', token }),
  events: () => apiFetch<{data:any[]}>('/events?status=published'),
  event: (id: string) => apiFetch<{data:any}>(`/events/${id}`),
  createEvent: (body: any, token?: string) => apiFetch('/events', { method: 'POST', body: JSON.stringify(body), token }),
  registerEvent: (id: string, body: any, token?: string) => apiFetch(`/events/${id}/register`, { method: 'POST', body: JSON.stringify(body), token }),
  eventAttendees: (id: string, token?: string) => apiFetch<{data:any[]}>(`/events/${id}/attendees`, { token }),
  resources: () => apiFetch<{data:any[]}>('/resources?status=published'),
  resource: (id: string) => apiFetch<{data:any}>(`/resources/${id}`),
  gallery: () => apiFetch<{data:any[]}>('/gallery?status=published'),
  programs: () => apiFetch<{data:any[]}>('/programs?status=published'),
  committees: () => apiFetch<{data:any[]}>('/committees'),
  magazines: () => apiFetch<{data:any[]}>('/magazines?status=published'),
  announcements: () => apiFetch<{data:any[]}>('/announcements?status=published'),
  prayerRequest: (body: any) => apiFetch('/forms/prayer-requests', { method: 'POST', body: JSON.stringify(body) }),
  counselingRequest: (body: any) => apiFetch('/forms/counseling-requests', { method: 'POST', body: JSON.stringify(body) }),
  donation: (body: any) => apiFetch('/forms/donations', { method: 'POST', body: JSON.stringify(body) }),
  newsletter: (body: any) => apiFetch('/forms/newsletter', { method: 'POST', body: JSON.stringify(body) }),
  getInvolved: (body: any) => apiFetch('/forms/involvement-requests', { method: 'POST', body: JSON.stringify(body) }),
  upload: (formData: FormData, token?: string) => apiFetch<{data:{publicUrl:string;storageRef:string;path:string;bucket:string}}>('/uploads', { method: 'POST', body: formData, token }),
}

export function fmtDate(value?: string) {
  if (!value) return 'Date to be announced'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export function hrefFor(table: string, item: any) {
  const id = item.slug || item.id
  if (table === 'posts') return `/news/${id}`
  if (table === 'events') return `/events/${id}`
  if (table === 'resources') return `/resources/${id}`
  return `/${table}/${id}`
}
