"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'service_type', label: 'Service Type', type: 'select', options: ['personal', 'relationship', 'academic', 'crisis'] },
  { name: 'preferred_counselor', label: 'Preferred Counselor', type: 'text' },
  { name: 'message', label: 'Message', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'select', options: ['pending', 'scheduled', 'completed'] },
  { name: 'appointment_date', label: 'Appointment Date', type: 'datetime-local' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['pending', 'scheduled', 'completed'] },
  { name: 'service_type', label: 'service_type', options: ['personal', 'relationship', 'academic', 'crisis'] }
]

export default function Page() {
  return <AdminResourcePage title="Counseling Requests" description="Manage counseling inquiries, scheduling status, and follow-up records." endpoint="/forms/counseling-requests" fields={fields as any} columns={['name', 'service_type', 'status', 'appointment_date']} filters={filters as any} readOnlyCreate={true} allowDelete={false} />
}
