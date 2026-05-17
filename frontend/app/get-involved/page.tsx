"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

const areas = [
  "Bible Study",
  "Prayer Ministry",
  "Music / Praise Team",
  "Media / Photography",
  "Evangelism / Outreach",
  "Ushering / Hospitality",
  "Counseling Support",
  "Events Team",
  "Technical / Website Support",
]

export default function GetInvolvedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      area_of_interest: String(form.get("area_of_interest") || ""),
      availability: String(form.get("availability") || ""),
      message: String(form.get("message") || ""),
    }

    try {
      await api.getInvolved(payload)
      setMessage("Thank you. Your request has been sent. A ministry leader will contact you.")
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || "Failed to submit request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F12] text-white">
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            ← Back to home
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80">Serve • Grow • Belong</p>
              <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">Get Involved</h1>
              <p className="mt-5 text-lg leading-8 text-white/70">
                Join a ministry team, help with events, serve through outreach, or connect with a committee. Submit your details and the team will follow up.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {areas.slice(0, 6).map((area) => (
                  <div key={area} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
              <h2 className="text-2xl font-bold">Tell us how you want to serve</h2>
              <p className="mt-2 text-sm text-white/60">Your details will be saved securely for ministry follow-up.</p>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Full name
                  <input name="name" required className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40" placeholder="Your full name" />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-white/80">
                    Email
                    <input name="email" type="email" required className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40" placeholder="you@example.com" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-white/80">
                    Phone / WhatsApp
                    <input name="phone" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40" placeholder="0760..." />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Area of interest
                  <select name="area_of_interest" required className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40">
                    <option value="" className="bg-gray-900">Choose an area</option>
                    {areas.map((area) => <option key={area} value={area} className="bg-gray-900">{area}</option>)}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Availability
                  <input name="availability" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40" placeholder="Example: Weekends, evenings, Sabbath afternoons" />
                </label>

                <label className="grid gap-2 text-sm font-medium text-white/80">
                  Message
                  <textarea name="message" rows={4} className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/40" placeholder="Tell us briefly how you would like to help" />
                </label>
              </div>

              {message && <p className="mt-4 rounded-xl border border-green-400/30 bg-green-500/15 p-3 text-sm text-green-100">{message}</p>}
              {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-100">{error}</p>}

              <Button disabled={loading} type="submit" className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-white/90">
                {loading ? "Submitting..." : "Submit involvement request"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
