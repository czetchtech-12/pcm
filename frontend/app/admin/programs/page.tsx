"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'schedule', label: 'Schedule', type: 'text' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'image_url', label: 'Program Image', type: 'image', uploadBucket: 'images', uploadFolder: 'programs' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft', 'published', 'archived'] }
]

export default function Page() {
  return <AdminResourcePage title="Programs" description="Create and maintain spiritual growth, outreach, and fellowship programs." endpoint="/programs" fields={fields as any} columns={['title', 'category', 'status', 'schedule']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
