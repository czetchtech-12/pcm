import Link from 'next/link'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { api, fmtDate } from '@/lib/api'


export default async function Page() {
  let items:any[] = []
  let settings:any = {}
  try { settings = (await api.publicSettings()).data?.settings || {} } catch { settings = {} }
  try { items = (await api.events()).data || [] } catch { items = [] }
  return <div className="min-h-screen bg-[#0B0F12] text-white"><Navbar />
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-10"><p className="text-emerald-300 uppercase tracking-[0.3em] text-sm">CBU SDA PCM</p><h1 className="text-4xl md:text-6xl font-bold mt-3">{settings.events_page_title || 'Events'}</h1><p className="text-white/70 mt-4 max-w-3xl">{settings.events_page_description || 'Upcoming services, outreach activities, Bible studies, fellowships, and special programs. Open an event to register.'}</p></section>
      {items.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">No published items yet.</div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((item:any) => <Link key={item.id || item.slug} href={`/events/${item.slug || item.id}`} className="rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden">
        {item.image_url ? <img src={item.image_url} alt={item.title || item.name} className="w-full h-52 object-cover" loading="lazy" /> : <div className="h-52 flex items-center justify-center bg-white/10 text-white/50">Image coming soon</div>}
        <div className="p-6"><p className="text-sm text-emerald-300">{item.category || item.type || fmtDate(item.date || item.published_at)}</p><h2 className="text-2xl font-semibold mt-2">{item.title || item.name}</h2><p className="text-white/70 mt-3 line-clamp-3">{item.excerpt || item.description || item.focus_area}</p><p className="text-white/50 mt-4 text-sm">{fmtDate(item.date)} • {item.location}</p></div>
      </Link>)}</div>}
    </main><Footer /></div>
}
