"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Upload Photo', type: 'image', required: true, uploadBucket: 'images', uploadFolder: 'gallery' },
  { name: 'category', label: 'Category', type: 'select', options: ['worship', 'events', 'outreach', 'fellowship', 'baptisms'] },
  { name: 'event_date', label: 'Event Date', type: 'date' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'attendees', label: 'Attendees', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft', 'published', 'archived'] },
  { name: 'category', label: 'category', options: ['worship', 'events', 'outreach', 'fellowship', 'baptisms'] }
]

export default function Page() {
  return <AdminResourcePage title="Gallery Manager" description="Publish, update, and archive ministry photos without editing code." endpoint="/gallery" fields={fields as any} columns={['title', 'category', 'location', 'event_date', 'status']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
