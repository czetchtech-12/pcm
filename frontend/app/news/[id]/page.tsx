import Link from 'next/link'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { api, fmtDate } from '@/lib/api'

export default async function NewsDetail({ params }: { params: { id: string } }) {
  let item:any = null
  try { item = (await api.post(params.id)).data } catch {}
  return <div className="min-h-screen bg-[#0B0F12] text-white"><Navbar /><main className="max-w-4xl mx-auto px-6 py-12">
    <Link href="/news" className="text-emerald-300">← Back to news</Link>
    {!item ? <p className="mt-8 text-white/70">Article not found.</p> : <article className="mt-8">
      {item.image_url && <img src={item.image_url} alt={item.title} className="w-full max-h-[480px] object-cover rounded-3xl mb-8" />}
      <p className="text-emerald-300">{item.category} • {fmtDate(item.published_at || item.created_at)}</p>
      <h1 className="text-4xl md:text-6xl font-bold mt-3">{item.title}</h1>
      <p className="text-white/70 mt-4">By {item.author?.name || 'CBU SDA PCM'}</p>
      <div className="prose prose-invert max-w-none mt-8 whitespace-pre-wrap leading-8">{item.content || item.excerpt}</div>
      <div className="mt-10 flex gap-3"><a className="px-5 py-3 rounded-full bg-emerald-500 text-black font-semibold" href={`https://wa.me/?text=${encodeURIComponent(item.title + ' - ' + (process.env.NEXT_PUBLIC_SITE_URL || ''))}`}>Share</a><Link className="px-5 py-3 rounded-full bg-white/10" href="/search">Find related content</Link></div>
    </article>}
  </main><Footer /></div>
}
