"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'focus_area', label: 'Focus Area', type: 'text' },
  { name: 'meeting_time', label: 'Meeting Time', type: 'text' },
  { name: 'meeting_location', label: 'Meeting Location', type: 'text' }
]

const filters: any[] = [
  
]

export default function Page() {
  return <AdminResourcePage title="Committees" description="Manage ministry committees, meeting details, focus areas, and leaders." endpoint="/committees" fields={fields as any} columns={['name', 'focus_area', 'meeting_time', 'meeting_location']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
