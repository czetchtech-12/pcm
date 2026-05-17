"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

const fallback = {
  site_name: 'CBU SDA Public Campus Ministries',
  contact_email: 'czetchtech@gmail.com',
  helpline: '0760102833',
  emergency_phone: '0776240927',
  location: 'CBU/KITWE/ZAMBIA',
  footer_note: 'A SIH project by Ginno Tech | Founder : Innocent Sichinga',
  facebook_url: '',
  instagram_url: '',
  whatsapp_url: ''
}

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>(fallback)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.publicSettings().then(res => setSettings({ ...fallback, ...(res.data?.settings || {}) })).catch(() => {})
  }, [])

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.newsletter({ email })
      setEmail('')
      setMessage('Subscribed successfully.')
    } catch (error: any) {
      setMessage(error.message || 'Could not subscribe right now.')
    }
  }

  const socials = [
    ['Facebook', settings.facebook_url],
    ['Instagram', settings.instagram_url],
    ['WhatsApp', settings.whatsapp_url],
  ].filter(([, url]) => url)

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold">{settings.site_name}</h3>
          <p className="mt-3 text-white/70">Spiritual growth, fellowship, service, resources, and pastoral care for the CBU community.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Connect with us</h4>
          <p className="text-white/70">Email: {settings.contact_email}</p>
          <p className="text-white/70">Helpline: {settings.helpline}</p>
          <p className="text-white/70">Emergency: {settings.emergency_phone}</p>
          <p className="text-white/70">Location: {settings.location}</p>
          {socials.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70 hover:text-white">{label}</a>)}</div>}
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick links</h4>
          <div className="grid grid-cols-2 gap-2 text-white/70">
            <Link href="/events">Events</Link><Link href="/resources">Resources</Link>
            <Link href="/news">News</Link><Link href="/gallery">Gallery</Link>
            <Link href="/counseling">Counseling</Link><Link href="/support">Support</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Ministry Updates</h4>
          <form onSubmit={subscribe} className="flex gap-2">
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40" />
            <button className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black">Join</button>
          </form>
          {message && <p className="mt-2 text-xs text-white/60">{message}</p>}
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-white/60">
        © 2026 {settings.site_name}. All rights reserved. | {settings.footer_note}
      </div>
    </footer>
  )
}
