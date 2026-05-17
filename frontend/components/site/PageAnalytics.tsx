"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

export function PageAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams?.toString()
    const path = query ? `${pathname}?${query}` : pathname
    api.analytics({ path, event: 'page_view' }).catch(() => null)
  }, [pathname, searchParams])

  return null
}
