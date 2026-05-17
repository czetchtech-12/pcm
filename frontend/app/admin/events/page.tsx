"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'date', label: 'Start Date & Time', type: 'datetime-local', required: true },
  { name: 'end_date', label: 'End Date & Time', type: 'datetime-local' },
  { name: 'location', label: 'Location', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['worship','outreach','study','fellowship','special'] },
  { name: 'max_attendees', label: 'Max Attendees', type: 'number' },
  { name: 'image_url', label: 'Event Image', type: 'image', uploadBucket: 'images', uploadFolder: 'events' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft','published','archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft','published','archived'] },
  { name: 'category', label: 'category', options: ['worship','outreach','study','fellowship','special'] }
]

export default function EventsAdminPage() {
  return <AdminResourcePage title="Events & Registrations" description="Create events, publish schedules, update details, and export attendee lists from each event detail endpoint." endpoint="/events" fields={fields as any} columns={['title','category','date','location','status','current_attendees']} filters={filters as any} />
}
