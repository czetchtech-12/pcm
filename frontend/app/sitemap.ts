import type { MetadataRoute } from 'next'
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export default function sitemap(): MetadataRoute.Sitemap { return ['','/events','/resources','/news','/gallery','/programs','/committees','/counseling','/support','/prayer-request','/search'].map(path=>({url: `${base}${path}`, lastModified: new Date()})) }
