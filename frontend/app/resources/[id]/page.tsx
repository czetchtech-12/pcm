import Link from 'next/link'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { api, fmtDate } from '@/lib/api'

export default async function ResourceDetail({ params }: { params: { id: string } }) {
  let item:any=null; try{ item=(await api.resource(params.id)).data }catch{}
  const file=item?.file_url || item?.download_url
  return <div className="min-h-screen bg-[#0B0F12] text-white"><Navbar /><main className="max-w-5xl mx-auto px-6 py-12"><Link href="/resources" className="text-emerald-300">← Back to resources</Link>
    {!item ? <p className="mt-8 text-white/70">Resource not found.</p> : <section className="mt-8"><p className="text-emerald-300">{item.type} • {item.category}</p><h1 className="text-4xl md:text-6xl font-bold mt-3">{item.title}</h1><p className="text-white/70 mt-4">{item.author || 'CBU SDA PCM'} • Uploaded {fmtDate(item.created_at)}</p><p className="text-white/75 mt-6 leading-8">{item.description}</p>{file ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4"><iframe src={file} className="w-full h-[70vh] rounded-2xl bg-white" title={item.title}></iframe><a href={file} className="inline-block mt-4 px-5 py-3 rounded-full bg-emerald-500 text-black font-semibold" target="_blank">Open / Download file</a></div> : <div className="mt-8 p-8 rounded-3xl border border-white/10 bg-white/5 text-white/60">File preview coming soon. Please check back later or contact the ministry team for this resource.</div>}</section>}
  </main><Footer /></div>
}
