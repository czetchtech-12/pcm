"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'requester_name', label: 'Requester Name', type: 'text' },
  { name: 'requester_email', label: 'Requester Email', type: 'email' },
  { name: 'category', label: 'Category', type: 'select', options: ['personal', 'family', 'health', 'academic', 'ministry'] },
  { name: 'request', label: 'Request', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'answered', 'archived'] }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['active', 'answered', 'archived'] },
  { name: 'category', label: 'category', options: ['personal', 'family', 'health', 'academic', 'ministry'] }
]

export default function Page() {
  return <AdminResourcePage title="Prayer Requests" description="Review, update, and archive submitted prayer requests with care." endpoint="/forms/prayer-requests" fields={fields as any} columns={['requester_name', 'category', 'status', 'created_at']} filters={filters as any} readOnlyCreate={true} allowDelete={false} />
}
