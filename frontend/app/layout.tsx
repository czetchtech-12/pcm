import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { PageAnalytics } from "@/components/site/PageAnalytics"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'CBU SDA Public Campus Ministries', template: '%s | CBU SDA PCM' },
  description: 'CBU SDA Public Campus Ministries: events, news, resources, counseling, prayer requests, gallery, and student fellowship at Copperbelt University.',
  keywords: ['CBU SDA PCM','Copperbelt University','Public Campus Ministries','Bible study','student fellowship','Kitwe Zambia'],
  openGraph: { title: 'CBU SDA Public Campus Ministries', description: 'Spiritual growth, fellowship, outreach, and resources for students.', type: 'website', images: ['/logo (2).png'] },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={null}><PageAnalytics />{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
