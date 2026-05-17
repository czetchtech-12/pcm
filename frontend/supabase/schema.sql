-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'leader', 'admin')),
  phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for news/blog/testimonies)
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL CHECK (category IN ('testimony', 'news', 'announcement', 'ministry')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  category VARCHAR NOT NULL CHECK (category IN ('worship', 'outreach', 'study', 'fellowship', 'special')),
  image_url VARCHAR,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Committees table
CREATE TABLE public.committees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  focus_area VARCHAR NOT NULL,
  meeting_time VARCHAR NOT NULL,
  meeting_location VARCHAR NOT NULL,
  leader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer requests table
CREATE TABLE public.prayer_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request TEXT NOT NULL,
  requester_name VARCHAR,
  requester_email VARCHAR,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
  category VARCHAR NOT NULL CHECK (category IN ('personal', 'family', 'health', 'academic', 'ministry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery items table
CREATE TABLE public.gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('worship', 'events', 'outreach', 'fellowship', 'baptisms')),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR NOT NULL,
  attendees INTEGER,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('bible_study', 'sermon', 'devotional', 'manual')),
  category VARCHAR NOT NULL,
  file_url VARCHAR,
  download_url VARCHAR,
  duration VARCHAR,
  lessons INTEGER,
  level VARCHAR DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  author VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL,
  skills TEXT[] DEFAULT '{}',
  availability VARCHAR NOT NULL,
  commitment_hours INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counseling requests table
CREATE TABLE public.counseling_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  service_type VARCHAR NOT NULL CHECK (service_type IN ('personal', 'relationship', 'academic', 'crisis')),
  preferred_counselor VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed')),
  appointment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name VARCHAR,
  donor_email VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('monthly', 'one_time', 'event_sponsorship', 'student_support')),
  purpose VARCHAR NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table (many-to-many)
CREATE TABLE public.event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Committee members table (many-to-many)
CREATE TABLE public.committee_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX idx_gallery_items_event_date ON public.gallery_items(event_date DESC);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_volunteers_status ON public.volunteers(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Everyone can read published posts, only authors and admins can modify
CREATE POLICY "Anyone can view published posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authors can manage their posts" ON public.posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Events: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Leaders can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Committees: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view committees" ON public.committees FOR SELECT USING (true);
CREATE POLICY "Leaders can manage committees" ON public.committees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Prayer requests: Everyone can read non-anonymous requests, anyone can insert
CREATE POLICY "Anyone can view non-anonymous prayer requests" ON public.prayer_requests FOR SELECT USING (
  NOT is_anonymous OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
CREATE POLICY "Anyone can submit prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaders can manage prayer requests" ON public.prayer_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Gallery: Everyone can read, authenticated users can upload, leaders can manage
CREATE POLICY "Anyone can view gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload to gallery" ON public.gallery_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their uploads" ON public.gallery_items FOR ALL USING (auth.uid() = uploaded_by);
CREATE POLICY "Leaders can manage all gallery items" ON public.gallery_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Resources: Everyone can read, leaders and admins can manage
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Leaders can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Volunteers: Users can manage their own applications, leaders can view all
CREATE POLICY "Users can manage their volunteer applications" ON public.volunteers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Leaders can view all volunteers" ON public.volunteers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Counseling: Users can manage their own requests, counselors can view assigned
CREATE POLICY "Users can manage their counseling requests" ON public.counseling_requests FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
CREATE POLICY "Anyone can submit counseling requests" ON public.counseling_requests FOR INSERT WITH CHECK (true);

-- Donations: Donors can view their own, admins can view all
CREATE POLICY "Anyone can make donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Event attendees: Users can manage their own registrations
CREATE POLICY "Users can manage their event registrations" ON public.event_attendees FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view event attendees" ON public.event_attendees FOR SELECT USING (true);

-- Committee members: Users can view memberships, leaders can manage
CREATE POLICY "Anyone can view committee members" ON public.committee_members FOR SELECT USING (true);
CREATE POLICY "Users can join committees" ON public.committee_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leaders can manage committee members" ON public.committee_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON public.committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_counseling_requests_updated_at BEFORE UPDATE ON public.counseling_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();