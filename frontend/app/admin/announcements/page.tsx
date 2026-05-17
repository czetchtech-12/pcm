"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'message', label: 'Message', type: 'textarea' },
  { name: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft', 'published', 'archived'] },
  { name: 'priority', label: 'priority', options: ['low', 'normal', 'high', 'urgent'] }
]

export default function Page() {
  return <AdminResourcePage title="Announcements" description="Control homepage and ministry announcements from the admin panel." endpoint="/announcements" fields={fields as any} columns={['title', 'priority', 'status', 'created_at']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
