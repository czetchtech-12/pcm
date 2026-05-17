'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { api } from '@/lib/api'

const methods = [
  { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
  { value: 'airtel_money', label: 'Airtel Money' },
  { value: 'zamtel_money', label: 'Zamtel Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'manual', label: 'Manual / Cash' },
]

export default function SupportPage() {
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.publicSettings().then(res => setSettings(res.data || {})).catch(() => {})
  }, [])

  async function submit(e: any) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setErr('')
    setMsg('')
    setSaving(true)
    try {
      await api.donation({
        donor_name: f.get('name'),
        donor_email: f.get('email'),
        donor_phone: f.get('phone'),
        amount: Number(f.get('amount')),
        currency: 'ZMW',
        type: f.get('type'),
        purpose: f.get('purpose') || 'General giving',
        payment_provider: f.get('payment_provider'),
        transaction_reference: f.get('transaction_reference'),
        is_anonymous: f.get('anonymous') === 'on'
      })
      setMsg('Giving record submitted. The treasurer will confirm it after checking the payment reference.')
      e.currentTarget.reset()
    } catch (ex: any) {
      setErr(ex.message || 'Failed to submit giving record')
    } finally {
      setSaving(false)
    }
  }

  return <div className="min-h-screen bg-[#0B0F12] text-white"><Navbar />
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Giving</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">Support the Ministry</h1>
      <p className="mt-4 max-w-3xl text-white/70">Support the ministry through the official giving instructions, then submit your reference so the treasurer can confirm your contribution.</p>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold">Payment instructions</h2>
          <p className="mt-3 whitespace-pre-line text-white/70">{settings.giving_instructions || 'Use official bank transfer or mobile money details provided by the treasurer, then submit the giving record for confirmation.'}</p>
        </div>
        <div className="rounded-3xl border border-amber-400/25 bg-amber-400/[0.08] p-6">
          <h2 className="text-2xl font-bold text-amber-100">Confirmation note</h2>
          <p className="mt-3 text-amber-50/75">For accuracy, giving records are confirmed by the treasurer after checking the mobile-money, bank, or cash confirmation.</p>
        </div>
      </section>

      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2">
        <label><span className="mb-2 block text-sm text-white/70">Donor name</span><input name="name" placeholder="Your name optional" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label><span className="mb-2 block text-sm text-white/70">Email for receipt/status</span><input name="email" type="email" placeholder="Email optional" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label><span className="mb-2 block text-sm text-white/70">Phone number</span><input name="phone" type="tel" placeholder="e.g. 0760 000 000" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label><span className="mb-2 block text-sm text-white/70">Amount *</span><input required name="amount" type="number" min="1" step="0.01" placeholder="Amount in ZMW" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label><span className="mb-2 block text-sm text-white/70">Payment method *</span><select required name="payment_provider" className="w-full rounded-xl border border-white/10 bg-black/40 p-3">{methods.map(method => <option key={method.value} value={method.value}>{method.label}</option>)}</select></label>
        <label><span className="mb-2 block text-sm text-white/70">Giving type</span><select name="type" className="w-full rounded-xl border border-white/10 bg-black/40 p-3"><option value="one_time">One-time</option><option value="monthly">Monthly</option><option value="event_sponsorship">Event sponsorship</option><option value="student_support">Student support</option></select></label>
        <label><span className="mb-2 block text-sm text-white/70">Purpose *</span><input required name="purpose" defaultValue="General giving" placeholder="e.g. Outreach, Resources, Event" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label><span className="mb-2 block text-sm text-white/70">Transaction/reference number</span><input name="transaction_reference" placeholder="Mobile money or bank reference" className="w-full rounded-xl border border-white/10 bg-black/40 p-3" /></label>
        <label className="flex gap-2 text-white/70 md:col-span-2"><input type="checkbox" name="anonymous" /> Display this gift anonymously in records</label>
        <div className="md:col-span-2"><button disabled={saving} className="w-full rounded-xl bg-emerald-500 p-3 font-semibold text-black hover:bg-emerald-400 disabled:opacity-60">{saving ? 'Submitting...' : 'Submit giving record'}</button></div>
        {msg && <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-200 md:col-span-2">{msg}</p>}
        {err && <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200 md:col-span-2">{err}</p>}
      </form>
    </main><Footer /></div>
}
