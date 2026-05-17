"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { name: 'content', label: 'Full Content', type: 'textarea', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['testimony','news','announcement','ministry'] },
  { name: 'image_url', label: 'Featured Image', type: 'image', uploadBucket: 'images', uploadFolder: 'posts' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft','published','archived'], defaultValue: 'published' },
  { name: 'published_at', label: 'Published At', type: 'datetime-local' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['draft','published','archived'] },
  { name: 'category', label: 'category', options: ['testimony','news','announcement','ministry'] }
]

export default function ContentAdminPage() {
  return <AdminResourcePage title="Content & News" description="Create, edit, publish, archive, and delete news, testimonies, ministry articles, and announcements." endpoint="/posts" fields={fields as any} columns={['title','category','status','published_at']} filters={filters as any} />
}
