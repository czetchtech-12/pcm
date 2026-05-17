"use client"

import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary'
import { useAuth } from '@/components/auth/AuthProvider'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, Calendar, Users, Image, BookOpen,
  Heart, HandHeart, MessageCircle, UserCheck, BarChart3, Settings,
  LogOut, Home, Menu, X, Search, Bell, ChevronDown, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Content & News', href: '/admin/content', icon: FileText },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Committees', href: '/admin/committees', icon: Users },
  { name: 'Programs', href: '/admin/programs', icon: BookOpen },
  { name: 'Magazines', href: '/admin/magazines', icon: FileText },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Prayer Requests', href: '/admin/prayers', icon: Heart },
  { name: 'Counseling', href: '/admin/counseling', icon: MessageCircle },
  { name: 'Volunteers', href: '/admin/volunteers', icon: HandHeart },
  { name: 'Donations', href: '/admin/donations', icon: HandHeart },
  { name: 'Users & Roles', href: '/admin/users', icon: UserCheck },
  { name: 'Analytics & Backup', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !profile || !['admin', 'leader'].includes(profile.role))) {
      router.push('/login?next=/admin')
    }
  }, [user, profile, loading, router])

  const activeTitle = useMemo(() => adminNavItems.find(item => pathname === item.href)?.name || 'Admin Panel', [pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1110] flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-emerald-900/20 bg-[#111816] p-8 shadow-sm">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-emerald-900/40" />
          <div className="mx-auto mt-5 h-5 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mx-auto mt-3 h-4 w-32 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    )
  }

  if (!user || !profile || !['admin', 'leader'].includes(profile.role)) return null

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5">
        <Link href="/admin" className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-500 shadow-lg shadow-emerald-950/40">
            <img src="/logo (2).png" alt="PCM" className="h-8 w-8 object-contain brightness-0 invert" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-100">PCM Admin</h2>
            <p className="text-xs font-medium text-slate-400">Ministry control center</p>
          </div>
        </Link>

        <nav className="space-y-1.5">
          {adminNavItems.map((item) => {
            const IconComponent = item.icon
            const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${active ? 'bg-emerald-500/15 text-amber-100 shadow-sm ring-1 ring-emerald-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-amber-100'}`}
              >
                <span className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${active ? 'text-emerald-300' : 'text-slate-500 group-hover:text-amber-300'}`} />
                  {item.name}
                </span>
                {active && <span className="h-2 w-2 rounded-full bg-amber-400" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-5">
        <div className="mb-4 rounded-3xl bg-gradient-to-br from-[#101816] to-[#050807] p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20" /> : <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-bold">{(profile.name || 'A').slice(0,1).toUpperCase()}</div>}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{profile.name}</p>
              <p className="inline-flex items-center gap-1 text-xs capitalize text-emerald-100"><ShieldCheck className="h-3 w-3" />{profile.role}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className="border-white/15 bg-white/10 text-white hover:bg-white/20">
              <Link href="/"><Home className="mr-2 h-4 w-4" />Site</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="border-red-300/20 bg-red-500/15 text-red-100 hover:bg-red-500/25">
              <LogOut className="mr-2 h-4 w-4" />Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-emerald-900/30 bg-[#0b1110]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">P</span>{activeTitle}</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl bg-white/10 p-2 text-slate-200" aria-label="Toggle sidebar">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex">
        <aside className="hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-emerald-950/70 bg-[#07100e] md:sticky md:top-0 md:flex">
          <SidebarContent />
        </aside>
        <aside className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col overflow-y-auto border-r border-emerald-950/70 bg-[#07100e] transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </aside>

        <div className="min-w-0 flex-1 bg-slate-100">
          <header className="hidden border-b border-slate-200 bg-white/95 px-8 py-4 shadow-sm backdrop-blur md:block">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><LayoutDashboard className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Control panel</p>
                  <h1 className="text-lg font-black text-slate-950">{activeTitle}</h1>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="relative hidden max-w-md flex-1 lg:block">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Search projects, requests, records..." />
                </div>
                <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm"><Bell className="h-5 w-5" /><span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-400" /></button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{(profile.name || 'A').slice(0,1).toUpperCase()}</div>}
                  <div className="hidden sm:block"><p className="text-sm font-bold leading-none">{profile.name}</p><p className="mt-1 text-xs capitalize text-slate-400">{profile.role}</p></div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </header>
          <AdminErrorBoundary>{children}</AdminErrorBoundary>
        </div>
      </div>
    </div>
  )
}
