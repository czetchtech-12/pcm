"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'type', label: 'Type', type: 'select', options: ['bible_study', 'sermon', 'devotional', 'manual'] },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'file_url', label: 'Preview File', type: 'file', uploadBucket: 'files', uploadFolder: 'resources' },
  { name: 'download_url', label: 'Download File', type: 'file', uploadBucket: 'files', uploadFolder: 'resources' },
  { name: 'duration', label: 'Duration', type: 'text' },
  { name: 'lessons', label: 'Lessons', type: 'number' },
  { name: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], defaultValue: 'published' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft', 'published', 'archived'] },
  { name: 'type', label: 'type', options: ['bible_study', 'sermon', 'devotional', 'manual'] }
]

export default function Page() {
  return <AdminResourcePage title="Resources Library" description="Manage Bible studies, sermons, manuals, devotionals, and downloads." endpoint="/resources" fields={fields as any} columns={['title', 'type', 'category', 'level', 'status']} filters={filters as any} readOnlyCreate={false} allowDelete={true} />
}
