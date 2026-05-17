"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'issue', label: 'Issue', type: 'text' },
  { name: 'cover_url', label: 'Magazine Cover', type: 'image', uploadBucket: 'images', uploadFolder: 'magazines' },
  { name: 'file_url', label: 'Magazine PDF/File', type: 'file', uploadBucket: 'files', uploadFolder: 'magazines' },
  { name: 'published_at', label: 'Published At', type: 'date' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft', 'published', 'archived'] }
]

export default function Page() {
  return <AdminResourcePage title="Magazines" description="Publish magazine issues, covers, descriptions, and reading/download links." endpoint="/magazines" fields={fields as any} columns={['title', 'issue', 'status', 'published_at']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
