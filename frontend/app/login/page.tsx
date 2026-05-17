"use client"

import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0B0F12] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src="/Slider/KCM_0669.jpg"
            alt="CBU SDA PCM fellowship"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-[#0B0F12]/90" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <div className="max-w-xl rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">CBU SDA PCM</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight">Welcome back to your ministry community.</h1>
              <p className="mt-4 leading-7 text-white/75">
                Sign in to continue with fellowship updates, events, resources, and member services.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              ← Back to home
            </Link>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
              <div className="relative h-40 lg:hidden">
                <img src="/Slider/KCM_0669.jpg" alt="CBU SDA PCM fellowship" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F12] to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
