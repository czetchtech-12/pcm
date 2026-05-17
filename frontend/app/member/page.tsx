"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { api, fmtDate } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Calendar, Heart, HandHeart, BookOpen, User, ShieldCheck, MessageCircle } from 'lucide-react'

export default function MemberDashboard() {
  const { user, profile, loading, signOut, accessToken, refreshProfile } = useAuth()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [historyError, setHistoryError] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const router = useRouter()
  const token = accessToken || undefined

  useEffect(() => { if (!loading && !user) router.push('/login?next=/member') }, [loading, user, router])
  useEffect(() => { if (!token) return; api.myRegistrations(token).then(res => setRegistrations(res.data || [])).catch(err => setHistoryError(err.message || 'Could not load your registrations')) }, [token])
  if (loading) return <main className="min-h-screen bg-[#0B0F12] text-white grid place-items-center">Loading your dashboard...</main>
  if (!user) return null


  const uploadAvatar = async (file?: File) => {
    if (!file || !token) return
    setAvatarUploading(true)
    setAvatarError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'avatars')
      fd.append('folder', 'profiles')
      const uploaded = await api.upload(fd, token)
      await api.updateMe({ avatar_url: uploaded.data.storageRef || uploaded.data.publicUrl }, token)
      await refreshProfile()
    } catch (err: any) {
      setAvatarError(err.message || 'Could not upload profile picture')
    } finally {
      setAvatarUploading(false)
    }
  }

  const actions = [
    { title: 'Browse Events', desc: 'Register for upcoming ministry events and programs.', href: '/events', icon: Calendar },
    { title: 'Submit Prayer Request', desc: 'Share a request with the prayer team confidentially.', href: '/prayer-request', icon: Heart },
    { title: 'Request Counseling', desc: 'Ask for confidential pastoral care and spiritual support.', href: '/counseling', icon: MessageCircle },
    { title: 'Get Involved', desc: 'Volunteer for outreach, music, media, hospitality, or Bible study.', href: '/get-involved', icon: HandHeart },
    { title: 'Study Resources', desc: 'Read Bible study materials, sermons, devotionals, and manuals.', href: '/resources', icon: BookOpen },
  ]

  return (
    <main className="min-h-screen bg-[#0B0F12] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-emerald-500/10 via-[#0B0F12] to-black px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="text-sm text-white/60 hover:text-white">← Back to website</Link>
              <h1 className="mt-4 text-4xl font-black tracking-tight">Welcome, {profile?.name || user.email}</h1>
              <p className="mt-2 text-white/65">Your member dashboard for CBU SDA Public Campus Ministries.</p>
            </div>
            <div className="flex gap-3">
              {(profile?.role === 'admin' || profile?.role === 'leader') && <Button asChild className="rounded-full bg-white text-black hover:bg-white/90"><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4"/>Admin Panel</Link></Button>}
              <Button onClick={signOut} variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10">Sign out</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile picture" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/15" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-black"><User className="h-9 w-9"/></div>}
            <label className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">
              {avatarUploading ? 'Uploading...' : 'Upload DP'}
              <input type="file" accept="image/*" className="hidden" disabled={avatarUploading} onChange={e=>uploadAvatar(e.target.files?.[0])} />
            </label>
          </div>
          {avatarError && <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-2 text-xs text-red-100">{avatarError}</p>}
          <h2 className="mt-5 text-xl font-bold">Member Profile</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div><dt className="text-white/45">Name</dt><dd className="mt-1 text-white/90">{profile?.name || 'Member'}</dd></div>
            <div><dt className="text-white/45">Email</dt><dd className="mt-1 text-white/90 break-all">{user.email}</dd></div>
            <div><dt className="text-white/45">Role</dt><dd className="mt-1 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200 capitalize ring-1 ring-emerald-400/20">{profile?.role || 'student'}</dd></div>
          </dl>
        </aside>

        <div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {actions.map((item) => {
              const Icon = item.icon
              return <Link key={item.href} href={item.href} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <Icon className="h-7 w-7 text-emerald-200" />
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.desc}</p>
              </Link>
            })}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">My recent registrations</h3>
            {historyError && <p className="mt-2 text-sm text-amber-200">{historyError}</p>}
            {registrations.length === 0 ? <p className="mt-2 text-white/65">No event registrations yet.</p> : <div className="mt-4 space-y-3">{registrations.map((item) => <Link key={item.id} href={`/events/${item.event?.slug || item.event?.id || item.event_id}`} className="block rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/5"><p className="font-semibold">{item.event?.title || 'Registered event'}</p><p className="text-sm text-white/55">{fmtDate(item.event?.date)} • {item.event?.location || 'Location to be announced'}</p></Link>)}</div>}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">Need help?</h3>
            <p className="mt-2 text-white/65">Contact the ministry team through counseling, prayer request, or the support details in the website footer.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
