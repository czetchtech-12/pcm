-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'leader', 'admin')),
  phone VARCHAR,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for news/blog/testimonies)
CREATE TABLE IF NOT EXISTS public.posts (
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
CREATE TABLE IF NOT EXISTS public.events (
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
CREATE TABLE IF NOT EXISTS public.committees (
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
CREATE TABLE IF NOT EXISTS public.prayer_requests (
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
CREATE TABLE IF NOT EXISTS public.gallery_items (
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
CREATE TABLE IF NOT EXISTS public.resources (
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
CREATE TABLE IF NOT EXISTS public.volunteers (
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
CREATE TABLE IF NOT EXISTS public.counseling_requests (
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
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name VARCHAR,
  donor_email VARCHAR,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  type VARCHAR NOT NULL CHECK (type IN ('monthly', 'one_time', 'event_sponsorship', 'student_support')),
  purpose VARCHAR NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table (many-to-many)
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Committee members table (many-to-many)
CREATE TABLE IF NOT EXISTS public.committee_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  committee_id UUID REFERENCES public.committees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(committee_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_event_date ON public.gallery_items(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON public.volunteers(status);

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
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Everyone can read published posts, only authors and admins can modify
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
CREATE POLICY "Anyone can view published posts" ON public.posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authors can manage their posts" ON public.posts;
CREATE POLICY "Authors can manage their posts" ON public.posts FOR ALL USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Events: Everyone can read, leaders and admins can manage
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Leaders can manage events" ON public.events;
CREATE POLICY "Leaders can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Committees: Everyone can read, leaders and admins can manage
DROP POLICY IF EXISTS "Anyone can view committees" ON public.committees;
CREATE POLICY "Anyone can view committees" ON public.committees FOR SELECT USING (true);
DROP POLICY IF EXISTS "Leaders can manage committees" ON public.committees;
CREATE POLICY "Leaders can manage committees" ON public.committees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Prayer requests: Everyone can read non-anonymous requests, anyone can insert
DROP POLICY IF EXISTS "Anyone can view non-anonymous prayer requests" ON public.prayer_requests;
CREATE POLICY "Anyone can view non-anonymous prayer requests" ON public.prayer_requests FOR SELECT USING (
  NOT is_anonymous OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON public.prayer_requests;
CREATE POLICY "Anyone can submit prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Leaders can manage prayer requests" ON public.prayer_requests;
CREATE POLICY "Leaders can manage prayer requests" ON public.prayer_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Gallery: Everyone can read, authenticated users can upload, leaders can manage
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery_items;
CREATE POLICY "Anyone can view gallery" ON public.gallery_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can upload to gallery" ON public.gallery_items;
CREATE POLICY "Authenticated users can upload to gallery" ON public.gallery_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Users can manage their uploads" ON public.gallery_items;
CREATE POLICY "Users can manage their uploads" ON public.gallery_items FOR ALL USING (auth.uid() = uploaded_by);
DROP POLICY IF EXISTS "Leaders can manage all gallery items" ON public.gallery_items;
CREATE POLICY "Leaders can manage all gallery items" ON public.gallery_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Resources: Everyone can read, leaders and admins can manage
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Leaders can manage resources" ON public.resources;
CREATE POLICY "Leaders can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Volunteers: Users can manage their own applications, leaders can view all
DROP POLICY IF EXISTS "Users can manage their volunteer applications" ON public.volunteers;
CREATE POLICY "Users can manage their volunteer applications" ON public.volunteers FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Leaders can view all volunteers" ON public.volunteers;
CREATE POLICY "Leaders can view all volunteers" ON public.volunteers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);

-- Counseling: Users can manage their own requests, counselors can view assigned
DROP POLICY IF EXISTS "Users can manage their counseling requests" ON public.counseling_requests;
CREATE POLICY "Users can manage their counseling requests" ON public.counseling_requests FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
);
DROP POLICY IF EXISTS "Anyone can submit counseling requests" ON public.counseling_requests;
CREATE POLICY "Anyone can submit counseling requests" ON public.counseling_requests FOR INSERT WITH CHECK (true);

-- Donations: Donors can view their own, admins can view all
DROP POLICY IF EXISTS "Anyone can make donations" ON public.donations;
CREATE POLICY "Anyone can make donations" ON public.donations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Event attendees: Users can manage their own registrations
DROP POLICY IF EXISTS "Users can manage their event registrations" ON public.event_attendees;
CREATE POLICY "Users can manage their event registrations" ON public.event_attendees FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;
CREATE POLICY "Anyone can view event attendees" ON public.event_attendees FOR SELECT USING (true);

-- Committee members: Users can view memberships, leaders can manage
DROP POLICY IF EXISTS "Anyone can view committee members" ON public.committee_members;
CREATE POLICY "Anyone can view committee members" ON public.committee_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join committees" ON public.committee_members;
CREATE POLICY "Users can join committees" ON public.committee_members FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Leaders can manage committee members" ON public.committee_members;
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
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_committees_updated_at ON public.committees;
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON public.committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_prayer_requests_updated_at ON public.prayer_requests;
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_volunteers_updated_at ON public.volunteers;
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_counseling_requests_updated_at ON public.counseling_requests;
CREATE TRIGGER update_counseling_requests_updated_at BEFORE UPDATE ON public.counseling_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Full-stack expansion additions
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft','published','archived'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','cancelled','archived'));
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','archived'));
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','archived'));
ALTER TABLE public.event_attendees ADD COLUMN IF NOT EXISTS name VARCHAR;
ALTER TABLE public.event_attendees ADD COLUMN IF NOT EXISTS email VARCHAR;
ALTER TABLE public.event_attendees ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS payment_provider VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS currency VARCHAR DEFAULT 'ZMW';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_phone VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR DEFAULT 'discipleship',
  image_url VARCHAR,
  meeting_time VARCHAR,
  meeting_location VARCHAR,
  leader_name VARCHAR,
  status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.magazines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  description TEXT,
  cover_url VARCHAR,
  file_url VARCHAR,
  issue_date DATE,
  status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  message TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active','unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources(slug);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_magazines_slug ON public.magazines(slug);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published programs" ON public.programs;
CREATE POLICY "Anyone can view published programs" ON public.programs FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Leaders can manage programs" ON public.programs;
CREATE POLICY "Leaders can manage programs" ON public.programs FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader','admin')));
DROP POLICY IF EXISTS "Anyone can view published magazines" ON public.magazines;
CREATE POLICY "Anyone can view published magazines" ON public.magazines FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Leaders can manage magazines" ON public.magazines;
CREATE POLICY "Leaders can manage magazines" ON public.magazines FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader','admin')));
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Leaders can manage announcements" ON public.announcements;
CREATE POLICY "Leaders can manage announcements" ON public.announcements FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader','admin')));
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE OR REPLACE FUNCTION increment_event_attendees(event_id_input uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.events SET current_attendees = COALESCE(current_attendees, 0) + 1 WHERE id = event_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Analytics events for lightweight internal reporting
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  path TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT 'page_view',
  metadata JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional audit log for content-management actions
CREATE TABLE IF NOT EXISTS public.content_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Involvement requests table for the Get Involved page
CREATE TABLE IF NOT EXISTS public.involvement_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  area_of_interest VARCHAR NOT NULL,
  availability VARCHAR,
  message TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.involvement_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit involvement requests" ON public.involvement_requests;
CREATE POLICY "Anyone can submit involvement requests" ON public.involvement_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leaders can view involvement requests" ON public.involvement_requests;
CREATE POLICY "Leaders can view involvement requests" ON public.involvement_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
  );

DROP POLICY IF EXISTS "Leaders can update involvement requests" ON public.involvement_requests;
CREATE POLICY "Leaders can update involvement requests" ON public.involvement_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('leader', 'admin'))
  );

CREATE INDEX IF NOT EXISTS idx_involvement_requests_status ON public.involvement_requests(status);
CREATE INDEX IF NOT EXISTS idx_involvement_requests_area ON public.involvement_requests(area_of_interest);

-- Production admin settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT one_site_settings_row CHECK (id = 1)
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
INSERT INTO public.site_settings (id, settings)
VALUES (1, '{"site_name":"CBU SDA Public Campus Ministries","contact_email":"czetchtech@gmail.com","helpline":"0760102833","emergency_phone":"0776240927","location":"CBU/KITWE/ZAMBIA","footer_note":"A SIH project by Ginno Tech | Founder : Innocent Sichinga","office_hours":"Mon–Fri, 08:00–17:00"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Safer member signup: public users still exist, roles are controlled by admins after signup
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- Production hardening: announcement priority and RLS for sensitive internal tables
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'normal' CHECK (priority IN ('urgent','high','normal','low'));

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can insert analytics events" ON public.analytics_events;
CREATE POLICY "Service role can insert analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read analytics events" ON public.analytics_events;
CREATE POLICY "Admins can read analytics events" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage audit logs" ON public.content_audit_logs;
CREATE POLICY "Admins can manage audit logs" ON public.content_audit_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- CONSOLIDATED FINAL PATCHES
-- These replace the old separate migration files.
-- Safe to run again because they use IF NOT EXISTS / ON CONFLICT.
-- ============================================================

-- Member avatar/profile picture support
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- Analytics hardening
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS ip_hash TEXT;
UPDATE public.analytics_events SET ip = NULL WHERE ip IS NOT NULL;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_registered ON public.event_attendees(user_id, registered_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_donations_status_created_at ON public.donations(status, created_at DESC);

-- Avatar storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Donation verification workflow
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS currency VARCHAR DEFAULT 'ZMW';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_phone VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS payment_provider VARCHAR;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'donations_amount_positive_check'
  ) THEN
    ALTER TABLE public.donations ADD CONSTRAINT donations_amount_positive_check CHECK (amount > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'donations_payment_provider_check'
  ) THEN
    ALTER TABLE public.donations ADD CONSTRAINT donations_payment_provider_check CHECK (
      payment_provider IS NULL OR payment_provider IN ('manual','mtn_mobile_money','airtel_money','zamtel_money','bank_transfer','flutterwave','paypal','dpo_pay')
    );
  END IF;
END $$;

-- Refresh Supabase/PostgREST schema cache after schema changes
NOTIFY pgrst, 'reload schema';
