"use client"

import { Lock, Sparkles, ShieldCheck, Wallet, Leaf, Plus, Minus, Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Footer } from "@/components/site/Footer"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [contactMessage, setContactMessage] = useState('')
  const [contactError, setContactError] = useState('')

  const defaultSliderImages = [
    "/Slider/KCM_0549.jpg",
    "/Slider/KCM_0799.jpg",
    "/Slider/KCM_0822.jpg"
  ]
  const sliderImages = (settings.hero_slider_images || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const activeSliderImages = sliderImages.length ? sliderImages : defaultSliderImages

  useEffect(() => {
    api.publicSettings().then(res => setSettings(res.data?.settings || {})).catch(() => {})
    api.announcements().then(res => setAnnouncements((res.data || []).filter((item: any) => ['urgent','high'].includes(item.priority || 'normal')).slice(0, 2))).catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSliderImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeSliderImages.length])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setContactMessage('')
    setContactError('')
    const form = new FormData(event.currentTarget)
    try {
      await api.getInvolved({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone') || '',
        area_of_interest: 'General contact inquiry',
        availability: 'Not specified',
        message: form.get('message')
      })
      setContactMessage('Message sent. The ministry team will follow up.')
      event.currentTarget.reset()
    } catch (error: any) {
      setContactError(error.message || 'Could not send your message right now.')
    }
  }

  const faqs = [
    { question: settings.faq_1_question || "What ministries does CBU SDA offer?", answer: settings.faq_1_answer || "We offer Bible studies, worship services, prayer groups, and evangelism training." },
    { question: settings.faq_2_question || "How can I join the ministry?", answer: settings.faq_2_answer || "Students can join by attending our weekly meetings or contacting our ministry team." },
    { question: settings.faq_3_question || "Do you offer spiritual counseling?", answer: settings.faq_3_answer || "Yes, we provide pastoral care and spiritual guidance for all students." },
    { question: settings.faq_4_question || "How do I get baptized?", answer: settings.faq_4_answer || "Contact our ministry leaders to discuss baptism and begin Bible study preparation." },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="relative min-h-screen">
        {announcements.length > 0 && (
          <div className="relative z-20 bg-emerald-500 px-6 py-3 text-center text-sm font-semibold text-black">
            {announcements.map((item) => <span key={item.id} className="mx-3">{item.title}: {item.message}</span>)}
          </div>
        )}
        {/* Background Slider */}
        <div className="absolute inset-0">
          {activeSliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        <nav className="relative z-10 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4 px-4 py-2 md:px-6 md:py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
            <img src="/logo (2).png" alt="Logo 2" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-1 flex-wrap">
            {[
              { name: "Committees", href: "/committees" },
              { name: "Events", href: "/events" },
              { name: "Resources", href: "/resources" },
              { name: "News", href: "/news" },
              { name: "Support", href: "/support" },
              { name: "Gallery", href: "/gallery" },
              { name: "Counseling", href: "/counseling" },
              { name: "Impact CBU", href: "/impact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 backdrop-blur rounded-full transition-colors text-sm ${
                  item.name === "Impact CBU"
                    ? "bg-[#0f2d6e] text-white hover:bg-[#1a3a8f] font-semibold ring-1 ring-sky-400/30"
                    : "bg-black/40 ring-1 ring-white/20 hover:bg-black/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors">
              Member Login
            </Link>
            <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6"><Link href="/get-involved">Get Involved</Link></Button>
          </div>

          <button
            className="md:hidden p-2 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col pt-24 pb-8 px-6 md:hidden">
            <div className="flex flex-col gap-3 flex-1">
              {[
                { name: "Committees", href: "/committees" },
                { name: "Events", href: "/events" },
                { name: "Resources", href: "/resources" },
                { name: "News", href: "/news" },
                { name: "Support", href: "/support" },
                { name: "Gallery", href: "/gallery" },
                { name: "Counseling", href: "/counseling" },
                { name: "Impact CBU", href: "/impact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-4 rounded-xl text-white text-lg font-medium transition-colors ${
                    item.name === "Impact CBU"
                      ? "bg-[#0f2d6e] ring-1 ring-sky-400/30 hover:bg-[#1a3a8f]"
                      : "bg-white/10 ring-1 ring-white/20 hover:bg-white/20"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="px-6 py-4 bg-white/10 ring-1 ring-white/20 rounded-xl text-white text-center text-lg font-medium">
                Member Login
              </Link>
              <Button asChild className="bg-white text-black hover:bg-white/90 rounded-xl py-4 text-lg"><Link href="/get-involved" onClick={() => setMenuOpen(false)}>Get Involved</Link></Button>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <span className="text-sm font-medium">{settings.homepage_eyebrow || "Faith • Community • Service"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance"><strong>{settings.homepage_title || "Find Your Purpose."}</strong></h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-4xl mb-10 md:mb-12 leading-relaxed text-pretty px-2">
            {settings.homepage_subtitle || "Join CBU SDA Public Campus Ministries for spiritual growth, community outreach, biblical studies, and meaningful fellowship with fellow believers."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg">
              <Link href="/get-involved">Join Our Ministry</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8 py-4 text-lg">
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Rooted in Faith & Scripture</span>
          </div>

          {/* Logo 2 in bottom right of hero */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
            <img src="/logo (1).png" alt="Logo 2" className="w-14 h-14 md:w-24 md:h-24 object-contain opacity-80" />
          </div>
        </div>
      </div>

      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 ring-1 ring-gray-300 mb-6">
                <Sparkles className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{settings.feature_1_title || "Biblical Teaching"}</h3>
              <p className="text-gray-600 leading-relaxed">{settings.feature_1_description || "Scripture-based studies led by experienced ministry leaders."}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 ring-1 ring-gray-300 mb-6">
                <ShieldCheck className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{settings.feature_2_title || "Welcoming Community"}</h3>
              <p className="text-gray-600 leading-relaxed">{settings.feature_2_description || "A Christ-centered environment for students of all backgrounds."}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 ring-1 ring-gray-300 mb-6">
                <Wallet className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{settings.feature_3_title || "Free Ministry Programs"}</h3>
              <p className="text-gray-600 leading-relaxed">{settings.feature_3_description || "All worship services and Bible studies are free to attend."}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 ring-1 ring-gray-300 mb-6">
                <Leaf className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{settings.feature_4_title || "Campus Outreach"}</h3>
              <p className="text-gray-600 leading-relaxed">{settings.feature_4_description || "Share God's love through service and evangelism."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gray-50 ring-1 ring-gray-200 p-6 md:p-12">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Your Faith Journey</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
                From worship and prayer to ministry training, here's how we grow together in Christ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-400 mb-4">01.</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Worship</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Join us for weekly worship services and praise gatherings.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-400 mb-4">02.</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Study</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Dive deep into God's Word through Bible studies and small groups.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-400 mb-4">03.</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Fellowship</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Build lasting friendships with fellow believers and ministry leaders.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-400 mb-4">04.</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Serve</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Share Christ's love through campus ministry and community service.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-12 py-4 text-lg font-semibold">
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gray-50 ring-1 ring-gray-200 p-6 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
              <div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed text-pretty">
                  Everything you need to know about CBU SDA Public Campus Ministries.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold pr-4 text-gray-900">{faq.question}</h3>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 flex-shrink-0 text-gray-700" />
                      ) : (
                        <Plus className="w-5 h-5 flex-shrink-0 text-gray-700" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gray-50 ring-1 ring-gray-200 p-6 md:p-12">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-gray-900">Connect With Us</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
              <div className="rounded-2xl bg-white text-black p-6 md:p-8 shadow-lg ring-1 ring-gray-200">
                <h3 className="text-2xl font-bold mb-6">Send an Inquiry</h3>
                <form onSubmit={submitInquiry} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us your questions..."
                    />
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 font-normal text-base">
                    Send Message
                  </Button>
                  {contactMessage && <p className="text-sm text-emerald-700">{contactMessage}</p>}
                  {contactError && <p className="text-sm text-red-700">{contactError}</p>}
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-xl text-gray-600 leading-relaxed text-pretty">
                    Have questions about our ministry? Get in touch with our pastoral team. We're here to support your spiritual journey.
                  </p>
                </div>

                <div className="rounded-2xl bg-white text-black p-6 shadow-lg ring-1 ring-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://www.elledecoration.vn/wp-content/uploads/2025/03/edam-garden.jpg"
                      alt="Campus Ministry Coordinator"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">Ministry Leadership Team</h4>
                      <p className="text-gray-600">Pastoral Care & Guidance</p>
                    </div>
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
