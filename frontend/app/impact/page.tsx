"use client"

import Link from "next/link"
import { CalendarDays, MapPin, HeartHandshake, BookOpen, Users, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/site/Navbar"
import { Footer } from "@/components/site/Footer"

const highlights = [
  {
    title: "Spiritual revival",
    text: "Evening messages, prayer moments, and worship focused on Christ and campus mission.",
    icon: BookOpen,
  },
  {
    title: "Campus service",
    text: "Outreach and practical service activities that meet real needs around the university community.",
    icon: HeartHandshake,
  },
  {
    title: "Student fellowship",
    text: "A week for students to connect, serve together, and grow in a grounded Christian community.",
    icon: Users,
  },
]

const plan = [
  "Opening worship and dedication",
  "Health and community outreach",
  "Bible study and prayer sessions",
  "Evening revival meetings",
  "Closing fellowship and thanksgiving",
]

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-[#0B0F12] text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/Slider/KCM_0549.jpg"
          alt="CBU SDA PCM gathering"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F12] via-[#0B0F12]/85 to-[#0B0F12]/45" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Impact CBU 2026</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              A week of worship, service, and campus mission.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Impact CBU brings students together for spiritual renewal, Bible-centered messages, prayer, outreach, and meaningful fellowship at Copperbelt University.
            </p>

            <div className="mt-8 flex flex-col gap-3 text-white/80 sm:flex-row sm:flex-wrap">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <CalendarDays className="mr-2 h-4 w-4 text-emerald-300" />
                12–19 April 2026
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <MapPin className="mr-2 h-4 w-4 text-emerald-300" />
                Copperbelt University
              </span>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://forms.gle/F8CZ42LMRQG4LyC86"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-white/90"
              >
                Register Now
              </a>
              <Link
                href="/impact/schedule"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                View Schedule <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">Theme text</p>
            <blockquote className="mt-4 text-2xl font-semibold leading-snug text-white md:text-3xl">
              “Arise, shine; for your light has come.”
            </blockquote>
            <p className="mt-3 text-emerald-300">Isaiah 60:1</p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
              <div>
                <p className="text-3xl font-black">7</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Days</p>
              </div>
              <div>
                <p className="text-3xl font-black">1</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Campus</p>
              </div>
              <div>
                <p className="text-3xl font-black">1</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Mission</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Icon className="h-7 w-7 text-emerald-300" />
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-3 leading-7 text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Program focus</p>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Simple, practical, and ministry-centered.</h2>
            <p className="mt-5 leading-8 text-white/70">
              The program is designed to be clear and useful: worship, teaching, service, outreach, and fellowship. No unnecessary noise — just a focused week of ministry on campus.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#0B0F12] p-6">
            <div className="space-y-3">
              {plan.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-300">
                    {index + 1}
                  </span>
                  <p className="text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-white/[0.03] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black">Join Impact CBU</h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Register to attend, serve, or invite someone who needs encouragement during the week.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="https://forms.gle/F8CZ42LMRQG4LyC86" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-6 py-3 text-center font-semibold text-black hover:bg-white/90">
                Register Now
              </a>
              <Link href="/get-involved" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
