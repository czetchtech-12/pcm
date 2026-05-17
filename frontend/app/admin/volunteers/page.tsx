"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'area_of_interest', label: 'Area of Interest', type: 'select', options: ['Bible Study', 'Music Ministry', 'Media Team', 'Ushering', 'Evangelism', 'Prayer Team', 'Counseling Support', 'Hospitality', 'Other'] },
  { name: 'availability', label: 'Availability', type: 'text' },
  { name: 'message', label: 'Message', type: 'textarea' },
  { name: 'status', label: 'Status', type: 'select', options: ['pending', 'contacted', 'approved', 'declined'] }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['pending', 'contacted', 'approved', 'declined'] }
]

export default function Page() {
  return <AdminResourcePage title="Get Involved Requests" description="Manage member involvement and volunteer interest submissions." endpoint="/forms/involvement-requests" fields={fields as any} columns={['name', 'area_of_interest', 'status', 'created_at']} filters={filters as any} readOnlyCreate={true} allowDelete={false} />
}
