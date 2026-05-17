"use client"

import Link from 'next/link'
import { Search, LogIn, HandHeart, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

const items = [
  ['Home','/'], ['Committees','/committees'], ['Events','/events'], ['Resources','/resources'],
  ['News','/news'], ['Support','/support'], ['Gallery','/gallery'], ['Counseling','/counseling']
]

export function Navbar() {
  const { user, profile } = useAuth()
  const admin = profile?.role === 'admin' || profile?.role === 'leader'
  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F12]/90 backdrop-blur border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold flex items-center gap-3"><img src="/logo (2).png" alt="CBU SDA PCM" className="w-10 h-10 object-contain" /> <span className="hidden sm:inline">CBU SDA PCM</span></Link>
        <div className="hidden xl:flex items-center gap-1 text-sm">
          {items.map(([name,href]) => <Link key={href} href={href} className="px-3 py-2 rounded-full hover:bg-white/10">{name}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/get-involved" className="hidden md:inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100 ring-1 ring-emerald-400/20 hover:bg-emerald-400/15"><HandHeart className="mr-2 h-4 w-4"/>Get Involved</Link>
          <Link href="/search" className="p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label="Search"><Search className="w-4 h-4" /></Link>
          <Link href={admin ? '/admin' : user ? '/member' : '/login'} className="inline-flex items-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90">{admin ? <LayoutDashboard className="mr-2 h-4 w-4"/> : <LogIn className="mr-2 h-4 w-4"/>}{admin ? 'Admin' : user ? 'Member' : 'Login'}</Link>
        </div>
      </div>
    </nav>
  )
}
