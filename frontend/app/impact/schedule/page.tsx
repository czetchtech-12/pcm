"use client"

import { Menu, X, Flame, ChevronLeft, Lock, Share2, Heart, Zap, Users, Wrench, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { name: "Committees", href: "/committees" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources" },
  { name: "News", href: "/news" },
  { name: "Support", href: "/support" },
  { name: "Gallery", href: "/gallery" },
  { name: "Counseling", href: "/counseling" },
  { name: "Impact CBU", href: "/impact" },
]

const socials = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.215a.75.75 0 0 0 .916.927l5.356-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.16-1.427l-.37-.217-3.882 1.065 1.065-3.882-.217-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

const programDays = [
  {
    date: "Pre-Week (Until April 11)",
    day: "PREPARATION PHASE",
    title: "Planning, Promotion & Setup",
    time: "Ongoing",
    description: "Planning, promotion, and resource gathering, including digital campaign setup and venue arrangements.",
    activities: [
      "Digital campaign setup and promotion",
      "Venue arrangements and logistics coordination",
      "Resource gathering and supply procurement",
      "Team mobilization and training"
    ],
    expectedAttendance: "Team coordination"
  },
  {
    date: "April 12",
    day: "SUNDAY",
    title: "Official Launch - Keep-CBU-Clean Campaign & Literature Distribution",
    time: "Morning/Afternoon & Evening",
    description: "Official launch of Impact CBU with campus cleaning campaign, literature distribution, and opening of the Health Exposition.",
    activities: [
      "Keep-CBU-Clean Campaign (morning/afternoon)",
      "Literature distribution with QR codes",
      "Bench installations (if budgeted)",
      "Health Exposition opens",
      "Week of Prayer session (20:15)"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 13-14",
    day: "MONDAY - TUESDAY",
    title: "Mid-Week Program & Health Exposition",
    time: "Full Day Activities",
    description: "Ongoing health screenings, spiritual nurturing, and daily devotions throughout the week.",
    activities: [
      "Health Exposition continues with screenings",
      "Morning devotions (7:00 AM)",
      "Daily health education sessions",
      "Fieldwork reviews and follow-ups",
      "Evening Week of Prayer (20:15)",
      "Literature distribution campaigns"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 15",
    day: "WEDNESDAY",
    title: "Guest Vespers Service",
    time: "18:30 - 19:30",
    description: "Special worship and preaching vespers with guest speakers at ST1 venue.",
    activities: [
      "Guest vespers at ST1 venue",
      "Special worship music and performances",
      "Testimonies and spiritual messages",
      "Literature and outreach materials",
      "Prayer time and intercessions"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 16",
    day: "THURSDAY",
    title: "Continued Outreach & Health Focus",
    time: "Full Day",
    description: "Intensive health messaging and spiritual outreach with continued evangelism activities.",
    activities: [
      "Health band presentations and screenings",
      "Mental and physical health talks",
      "Door-to-door literature distribution",
      "Student testimonies and group sharing",
      "Evening Week of Prayer session",
      "Follow-up Bible studies"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 17",
    day: "FRIDAY EVENING",
    title: "Bible Expository with Special Guest",
    time: "Evening Session",
    description: "In-depth biblical teaching with a special guest presenter focusing on discipleship and gospel truths.",
    activities: [
      "Guest presenter - Bible expository session",
      "1000-person capacity venue",
      "Worship music and spiritual performances",
      "Discipleship focus and commitment calls",
      "Refreshments provided",
      "Live-streaming and digital reach"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 18",
    day: "SATURDAY",
    title: "Door-to-Door Evangelism & Outdoor Poetry Night",
    time: "08:30 - 17:00 (Field), Evening (Poetry)",
    description: "Intensive door-to-door evangelism in the morning with field work, followed by poetry night in the evening.",
    activities: [
      "Morning: Lesson review (08:30-10:00)",
      "Campus field work (10:30-13:00)",
      "Q&A Bible study session (14:00-16:00)",
      "Field review and reflection (16:00-17:00)",
      "Outdoor Poetry Night (evening)",
      "Faith-themed performances and music",
      "Live-streaming of poetry event"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "April 19",
    day: "SUNDAY",
    title: "Cultural Health Feast - Closing Event",
    time: "08:30 - 14:00",
    description: "Closing celebration featuring diverse healthy meals, health expo elements, testimonies, and spiritual commitments.",
    activities: [
      "Diverse healthy meals and catering",
      "Health cooking and living exposition",
      "Testimonies and spiritual commitments",
      "Music integration and performances",
      "Academic and faith presentations",
      "Closing prayers",
      "Follow-up promotions and digital recaps"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  },
  {
    date: "Post-Week",
    day: "FOLLOW-UP PHASE",
    title: "Sustainable Follow-Ups & Baptism",
    time: "Ongoing",
    description: "Sustained spiritual nurturing through digital groups, online studies, and preparation for baptism ceremony.",
    activities: [
      "Digital groups and WhatsApp follow-ups",
      "Zoom Bible studies and online classes",
      "Email newsletters and devotionals",
      "Personal follow-ups and mentoring",
      "Baptism ceremony (following Sabbath if ready)",
      "Long-term discipleship programs"
    ],
    expectedAttendance: "Attendance tracked by registration and ministry reports"
  }
]

export default function SchedulePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between p-4 md:p-6 border-b border-white/10">
        <Link href="/impact" className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-sky-300" />
          <span className="text-sm text-white/70">Back</span>
        </Link>

        <div className="flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
          <img src="/logo (2).png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-1 flex-wrap justify-center">
          {navLinks.map((item) => (
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

        <button
          className="md:hidden p-2 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col pt-24 pb-8 px-6 md:hidden">
          <div className="flex flex-col gap-3 flex-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-6 py-4 rounded-xl text-white text-lg font-medium transition-colors ${
                  item.name === "Impact CBU"
                    ? "bg-[#0f2d6e] ring-1 ring-sky-400/30 hover:bg-[#1a3a8f]"
                    : "bg-white/10 ring-1 ring-white/20 hover:bg-white/20"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-xl py-4 text-lg w-full">
            <Link href="/get-involved" onClick={() => setMenuOpen(false)}>Get Involved</Link>
          </Button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#0f2d6e]/20 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2d6e]/50 ring-1 ring-sky-400/30 rounded-full mb-6 w-fit mx-auto">
            <Flame className="w-4 h-4 text-sky-300" />
            <span className="text-sky-300 text-sm font-semibold tracking-widest uppercase">Program Schedule</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">IMPACT </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-white">CBU 2026</span>
          </h1>
          <p className="text-white/80 text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            April 12–19, 2026 · Copperbelt University
          </p>
          <p className="text-sky-300/80 text-lg max-w-2xl mx-auto">
            A comprehensive week-long evangelistic and spiritual revival series
          </p>
        </div>
      </section>

      {/* MISSION & OBJECTIVES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* MISSION */}
          <div>
            <h2 className="text-3xl font-black text-sky-300 mb-6">Mission</h2>
            <p className="text-white/90 leading-relaxed">
              Project Impact-CBU is a reimagined Mission-On-Campus initiative themed to galvanize Copperbelt University (CBU) students as vibrant ambassadors for the Seventh-day Adventist gospel commission. It addresses campus challenges such as inadequate ministry impact, spiritual outreach gaps, and the need for holistic evangelism while fostering radical discipleship and missionary service. Aligned with GYC Africa's vision of "Transforming Africa for Christ," it empowers African youth spiritually, physically, mentally, socially, and economically as agents of positive change.
            </p>
          </div>

          {/* KEY OBJECTIVES */}
          <div>
            <h2 className="text-3xl font-black text-sky-300 mb-6">Key Objectives</h2>
            <ul className="space-y-3">
              {[
                "Direct campus evangelism & outreach",
                "Strengthen ministry impact & presence",
                "Spiritual growth & discipleship",
                "Holistic health promotion",
                "Digital evangelism expansion",
                "Campus venue renovation (ST1)",
                "Sustainable follow-up systems",
                "Student empowerment for service"
              ].map((obj, idx) => (
                <li key={idx} className="flex gap-3 text-white/90">
                  <span className="text-sky-300 font-bold shrink-0">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROGRAM SCHEDULE BY DAY */}
      <section className="py-16 px-6 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-sky-300 mb-12 text-center">Program Schedule</h2>

          <div className="space-y-6">
            {programDays.map((dayInfo, idx) => (
              <div key={idx} className="group">
                <div className="bg-gradient-to-r from-[#0f2d6e]/30 to-white/5 border border-sky-400/30 rounded-xl p-6 md:p-8 hover:border-sky-400/50 transition-all duration-300">
                  {/* Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sky-300/60 text-xs uppercase tracking-widest font-bold mb-1">Date</p>
                      <p className="text-white font-bold text-lg">{dayInfo.date}</p>
                      <p className="text-sky-300 text-sm font-semibold mt-1">{dayInfo.day}</p>
                    </div>
                    <div>
                      <p className="text-sky-300/60 text-xs uppercase tracking-widest font-bold mb-1">Time</p>
                      <p className="text-white font-bold text-lg">{dayInfo.time}</p>
                    </div>
                    <div>
                      <p className="text-sky-300/60 text-xs uppercase tracking-widest font-bold mb-1">Attendance</p>
                      <p className="text-white font-bold text-lg">{dayInfo.expectedAttendance}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{dayInfo.title}</h3>

                  {/* Description */}
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">{dayInfo.description}</p>

                  {/* Activities */}
                  <div className="bg-white/5 border border-sky-300/20 rounded-lg p-6">
                    <h4 className="text-sky-300 font-bold uppercase tracking-wider text-sm mb-4">Activities & Events</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dayInfo.activities.map((activity, actIdx) => (
                        <li key={actIdx} className="flex gap-3 text-white/90">
                          <span className="text-sky-300 font-bold shrink-0">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY HIGHLIGHTS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-sky-300 mb-12 text-center">Week Highlights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Digital Reach",
                desc: "Social media blitz, QR-code literature, online follow-ups & targeted ads",
                Icon: Share2
              },
              {
                title: "Health Focus",
                desc: "Daily health screenings, education sessions, and holistic wellness programs",
                Icon: Heart
              },
              {
                title: "Spiritual Growth",
                desc: "Daily devotions, prayers, bible studies, and discipleship formation",
                Icon: Zap
              },
              {
                title: "Campus Impact",
                desc: "Campus outreach and digital engagement across the ministry",
                Icon: Users
              },
              {
                title: "Community Service",
                desc: "Campus cleanup, venue renovation, and sustainable service projects",
                Icon: Wrench
              },
              {
                title: "Follow-Up System",
                desc: "Digital groups, email newsletters, zoom studies for continued growth",
                Icon: Mail
              }
            ].map((highlight, idx) => {
              const { Icon, ...rest } = highlight
              return (
                <div key={idx} className="bg-gradient-to-br from-[#0f2d6e]/40 to-white/5 border border-sky-400/20 rounded-xl p-6 hover:border-sky-400/50 transition-all duration-300">
                  <Icon className="w-12 h-12 text-sky-300 mb-3" />
                  <h3 className="text-xl font-bold text-sky-300 mb-2">{rest.title}</h3>
                  <p className="text-white/80">{rest.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EVENT POSTERS SECTION */}
      <section className="py-16 px-6 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-sky-300 mb-12 text-center">Event Posters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "/posters/WhatsApp Image 2026-03-31 at 11.29.28.jpeg",
              "/posters/WhatsApp Image 2026-03-31 at 11.29.28 (1).jpeg",
              "/posters/WhatsApp Image 2026-03-31 at 11.29.29.jpeg"
            ].map((poster, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-sky-400/30 hover:border-sky-400/50 transition-all duration-300 shadow-lg">
                <img 
                  src={poster} 
                  alt={`Event Poster ${idx + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-bold text-sm">Impact CBU 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Make an Impact?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join us for a week-long journey of spiritual transformation, service, and community impact at Copperbelt University.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0f2d6e] hover:bg-sky-50 rounded-full px-8 text-lg font-bold shadow-xl" asChild>
              <Link href="/get-involved">
                Get Involved
              </Link>
            </Button>
            <Button size="lg" className="bg-[#0f2d6e] hover:bg-[#1a3a8f] text-white rounded-full px-8 text-lg font-bold shadow-xl ring-1 ring-sky-400/30" asChild>
              <Link href="/support">Support Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-16 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black ring-1 ring-gray-800 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
              {/* Brand column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logo (1).png" alt="Logo 1" className="w-8 h-8 object-contain" />
                  <img src="/logo (2).png" alt="Logo 2" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-semibold text-white">CBU SDA Public Campus Ministries</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm mb-6">
                  Proclaiming the everlasting gospel and preparing students for Christ's second coming through biblical education and Christian fellowship.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-gray-400 hover:bg-[#0f2d6e]/60 hover:text-sky-300 hover:ring-sky-400/30 transition-all duration-200"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white">Quick Links</h3>
                <ul className="space-y-3">
                  {["Back to Impact", "Get Involved", "Contact Us", "FAQs"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white">Resources</h3>
                <ul className="space-y-3">
                  {["Download Flyer", "Event Guidelines", "Team Roles", "Contact Us"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">© 2026 CBU SDA Public Campus Ministries</p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Lock className="w-3 h-3" />
                <span>Rooted in Faith &amp; Scripture</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
