'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { api, fmtDate } from '@/lib/api'

export default function EventDetail({ params }: { params: { id: string } }) {
  const [item,setItem]=useState<any>(null); const [sent,setSent]=useState(''); const [err,setErr]=useState('')
  useEffect(()=>{ api.event(params.id).then(r=>setItem(r.data)).catch(()=>setErr('Event not found.')) },[params.id])
  async function submit(e:any){ e.preventDefault(); setErr(''); const f=new FormData(e.currentTarget); try{ await api.registerEvent(params.id,{name:f.get('name'),email:f.get('email'),phone:f.get('phone')}); setSent('Registration received. The ministry team will keep your details for this event.'); e.currentTarget.reset()}catch(ex:any){setErr(ex.message)} }
  return <div className="min-h-screen bg-[#0B0F12] text-white"><Navbar /><main className="max-w-5xl mx-auto px-6 py-12"><Link href="/events" className="text-emerald-300">← Back to events</Link>
    {err && !item ? <p className="mt-8 text-red-300">{err}</p> : item && <div className="grid gap-8 lg:grid-cols-[1fr_380px] mt-8"><section>{item.image_url && <img src={item.image_url} className="rounded-3xl w-full max-h-[460px] object-cover" alt={item.title}/>}<p className="text-emerald-300 mt-6">{fmtDate(item.date)} • {item.location}</p><h1 className="text-4xl md:text-6xl font-bold mt-3">{item.title}</h1><p className="text-white/75 mt-6 whitespace-pre-wrap leading-8">{item.description}</p></section><form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit"><h2 className="text-2xl font-bold">Register for this event</h2><p className="text-white/60 mt-2">You will receive confirmation from the ministry team.</p><input required name="name" placeholder="Full name" className="mt-5 w-full p-3 rounded-xl bg-black/40 border border-white/10"/><input required type="email" name="email" placeholder="Email" className="mt-3 w-full p-3 rounded-xl bg-black/40 border border-white/10"/><input name="phone" placeholder="Phone" className="mt-3 w-full p-3 rounded-xl bg-black/40 border border-white/10"/><button className="mt-4 w-full p-3 rounded-xl bg-emerald-500 text-black font-semibold">Register</button>{sent && <p className="mt-3 text-emerald-300">{sent}</p>}{err && <p className="mt-3 text-red-300">{err}</p>}</form></div>}
  </main><Footer /></div>
}
