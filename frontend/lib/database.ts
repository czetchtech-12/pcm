import { supabase } from './supabase'
import type { 
  User, Post, Event, Committee, PrayerRequest, 
  GalleryItem, Resource, Volunteer, Counseling, Donation 
} from './supabase'

// Posts/News/Blog functions
export const getPosts = async (category?: string, limit?: number) => {
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users(name, email)
      `)
      .order('published_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data as (Post & { author: Pick<User, 'name' | 'email'> })[]
  } catch (error) {
    console.warn('Database not available during build:', error)
    return []
  }
}

export const getPost = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(name, email)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Post & { author: Pick<User, 'name' | 'email'> }
}

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data as Post
}

// Events functions
export const getEvents = async (category?: string, upcoming?: boolean) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (upcoming) {
      query = query.gte('date', new Date().toISOString())
    }

    const { data, error } = await query
    if (error) throw error
    return data as Event[]
  } catch (error) {
    console.warn('Database not available during build:', error)
    return []
  }
}

export const getEvent = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Event
}

export const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees'>) => {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, current_attendees: 0 })
    .select()
    .single()

  if (error) throw error
  return data as Event
}

export const registerForEvent = async (eventId: string, userId: string) => {
  const { data, error } = await supabase
    .from('event_attendees')
    .insert({ event_id: eventId, user_id: userId })
    .select()
    .single()

  if (error) throw error

  // Update attendee count
  await supabase.rpc('increment_event_attendees', { event_id: eventId })

  return data
}

// Committees functions
export const getCommittees = async () => {
  const { data, error } = await supabase
    .from('committees')
    .select(`
      *,
      leader:users(name, email)
    `)
    .order('name')

  if (error) throw error
  return data as (Committee & { leader: Pick<User, 'name' | 'email'> | null })[]
}

export const getCommittee = async (id: string) => {
  const { data, error } = await supabase
    .from('committees')
    .select(`
      *,
      leader:users(name, email),
      members:committee_members(
        user:users(name, email),
        role,
        joined_at
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const joinCommittee = async (committeeId: string, userId: string, role: string = 'member') => {
  const { data, error } = await supabase
    .from('committee_members')
    .insert({ committee_id: committeeId, user_id: userId, role })
    .select()
    .single()

  if (error) throw error
  return data
}

// Prayer requests functions
export const getPrayerRequests = async (status?: string) => {
  try {
    let query = supabase
      .from('prayer_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data as PrayerRequest[]
  } catch (error) {
    console.warn('Database not available during build:', error)
    return []
  }
}

export const createPrayerRequest = async (request: Omit<PrayerRequest, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({ ...request, status: 'active' })
    .select()
    .single()

  if (error) throw error
  return data as PrayerRequest
}

// Gallery functions
export const getGalleryItems = async (category?: string) => {
  try {
    let query = supabase
      .from('gallery_items')
      .select('*')
      .order('event_date', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return data as GalleryItem[]
  } catch (error) {
    console.warn('Database not available during build:', error)
    return []
  }
}

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('gallery_items')
    .insert(item)
    .select()
    .single()

  if (error) throw error
  return data as GalleryItem
}

// Resources functions
export const getResources = async (type?: string) => {
  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Resource[]
}

export const getResource = async (id: string) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Resource
}

// Volunteers functions
export const getVolunteers = async (committeeId?: string) => {
  let query = supabase
    .from('volunteers')
    .select(`
      *,
      user:users(name, email),
      committee:committees(name)
    `)
    .order('created_at', { ascending: false })

  if (committeeId) {
    query = query.eq('committee_id', committeeId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createVolunteerApplication = async (volunteer: Omit<Volunteer, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('volunteers')
    .insert({ ...volunteer, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data as Volunteer
}

// Counseling functions
export const getCounselingRequests = async (status?: string) => {
  let query = supabase
    .from('counseling_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Counseling[]
}

export const createCounselingRequest = async (request: Omit<Counseling, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('counseling_requests')
    .insert({ ...request, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data as Counseling
}

// Donations functions
export const createDonation = async (donation: Omit<Donation, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('donations')
    .insert({ ...donation, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data as Donation
}

// User functions
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as User
}

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as User
}

export const createUser = async (user: Omit<User, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single()

  if (error) throw error
  return data as User
}