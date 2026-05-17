-- Sample data for CBU SDA Public Campus Ministries

-- Insert sample users (these will need to be created through Supabase Auth first)
-- This is just for reference - actual user creation happens through auth
INSERT INTO public.users (id, email, name, role, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'pastor.johnson@cbusda.org', 'Pastor Johnson', 'admin', '(555) 123-4567'),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah.martinez@student.cbu.edu', 'Sarah Martinez', 'student', '(555) 234-5678'),
  ('550e8400-e29b-41d4-a716-446655440003', 'michael.rodriguez@cbusda.org', 'Pastor Michael Rodriguez', 'leader', '(555) 345-6789'),
  ('550e8400-e29b-41d4-a716-446655440004', 'emily.chen@cbusda.org', 'Dr. Emily Chen', 'leader', '(555) 456-7890'),
  ('550e8400-e29b-41d4-a716-446655440005', 'david.kim@student.cbu.edu', 'David Kim', 'student', '(555) 567-8901');

-- Insert committees
INSERT INTO public.committees (name, description, focus_area, meeting_time, meeting_location, leader_id, activities) VALUES
  ('Worship Committee', 'Leading praise and worship services, organizing music ministry, and coordinating special musical events.', 'Music Ministry & Worship', 'Sundays 2:00 PM', 'Music Room', '550e8400-e29b-41d4-a716-446655440003', ARRAY['Weekly worship services', 'Special music events', 'Choir coordination', 'Instrument training']),
  ('Bible Study Committee', 'Organizing Bible study groups, developing curriculum, and facilitating small group discussions.', 'Biblical Education & Growth', 'Wednesdays 7:00 PM', 'Conference Room A', '550e8400-e29b-41d4-a716-446655440001', ARRAY['Weekly Bible studies', 'Curriculum development', 'Small group facilitation', 'Scripture memorization']),
  ('Evangelism Committee', 'Campus outreach, community service projects, and sharing the gospel with fellow students.', 'Outreach & Mission', 'Fridays 6:00 PM', 'Ministry Center', '550e8400-e29b-41d4-a716-446655440003', ARRAY['Campus evangelism', 'Community service', 'Mission trips', 'Literature distribution']),
  ('Fellowship Committee', 'Building community through social events, welcoming new members, and fostering relationships.', 'Community & Relationships', 'Saturdays 4:00 PM', 'Fellowship Hall', '550e8400-e29b-41d4-a716-446655440004', ARRAY['Social events', 'New member orientation', 'Game nights', 'Potluck dinners']),
  ('Prayer Ministry', 'Coordinating prayer groups, maintaining prayer chains, and providing spiritual support.', 'Prayer & Spiritual Support', 'Daily 6:00 AM', 'Prayer Garden', '550e8400-e29b-41d4-a716-446655440001', ARRAY['Prayer meetings', 'Prayer chains', 'Intercessory prayer', 'Spiritual counseling']),
  ('Media Committee', 'Managing digital content, live streaming services, and maintaining online presence.', 'Digital Ministry & Communication', 'Thursdays 5:00 PM', 'Media Room', '550e8400-e29b-41d4-a716-446655440004', ARRAY['Live streaming', 'Social media management', 'Website updates', 'Audio/visual support']);

-- Insert sample posts (news/testimonies)
INSERT INTO public.posts (title, content, excerpt, author_id, category, image_url) VALUES
  ('Student Testimony: Finding Hope in Christ', 'My name is Sarah Martinez, and I want to share how God transformed my life during my darkest moments. When I first came to CBU, I was struggling with severe depression and anxiety. I felt lost and alone, questioning my purpose and worth. It was during a particularly difficult semester that a friend invited me to attend a Bible study group at our campus ministry. I was hesitant at first, but something drew me to give it a try. The warmth and acceptance I found there was unlike anything I had experienced before. Through studying God''s Word and the support of my new spiritual family, I began to understand that my identity wasn''t defined by my struggles, but by God''s love for me. The ministry team provided not just spiritual guidance, but practical support during my healing journey. Today, I can say with confidence that Christ has given me hope, purpose, and a future. I''m now actively involved in our prayer ministry, helping other students who are facing similar challenges.', 'Sarah Martinez shares her powerful testimony of overcoming depression and finding purpose through our campus ministry community.', '550e8400-e29b-41d4-a716-446655440002', 'testimony', '/placeholder.jpg'),
  
  ('Revival Week Transforms Campus', 'Our recent Revival Week exceeded all expectations, with over 300 students attending the nightly meetings. Guest speaker Elder Martinez delivered powerful messages on God''s love and the urgency of the times. The Holy Spirit moved in remarkable ways, with 25 students requesting baptism and many more making recommitments to Christ. The week featured inspiring music, personal testimonies, and interactive workshops on topics like prayer, Bible study, and Christian living. One of the most moving moments was the final night''s altar call, where students came forward to surrender their lives to Jesus. The impact continues to ripple through our campus community, with increased attendance at our regular Bible studies and worship services. We praise God for His faithfulness and the transformation we witnessed in so many young hearts.', 'Over 300 students attended our recent Revival Week, with 25 baptisms and countless lives transformed by God''s love.', '550e8400-e29b-41d4-a716-446655440001', 'news', '/placeholder.jpg'),
  
  ('From Addiction to Freedom: Michael''s Story', 'I never thought I would be sharing my story publicly, but God has done such an incredible work in my life that I can''t keep quiet. My name is Michael Thompson, and I''m a junior at CBU. For two years, I battled with substance abuse that nearly destroyed my academic career and relationships. I was living a double life - appearing successful on the outside while struggling with addiction in private. Everything changed when I attended a campus ministry event about God''s healing power. The message spoke directly to my heart, and I realized I couldn''t overcome this battle alone. I reached out to Pastor Rodriguez, who connected me with our recovery support group. Through prayer, accountability, and the unwavering support of my ministry family, God delivered me from addiction. It wasn''t easy - there were setbacks and moments of doubt - but the community never gave up on me. Today, I''m celebrating one year of sobriety and actively mentoring other students facing similar struggles. God truly makes all things new.', 'A powerful testimony of how God delivered Michael from substance abuse and gave him a new life through our recovery ministry.', '550e8400-e29b-41d4-a716-446655440005', 'testimony', '/placeholder.jpg'),
  
  ('Community Service Reaches 1,000 Hours', 'We are thrilled to announce that our students have contributed over 1,000 volunteer hours this semester to various community service projects. This milestone represents the heart of our ministry - serving others as Christ served us. Our outreach initiatives have included weekly visits to local homeless shelters, food distribution at community centers, tutoring programs for underprivileged children, and environmental cleanup projects. The impact extends beyond the numbers, as these service opportunities have provided our students with hands-on experience in Christian compassion and social responsibility. Many participants have shared how serving others has deepened their faith and broadened their perspective on social justice issues. We''re particularly proud of our partnership with the local food bank, where our students have helped distribute meals to over 500 families in need. This achievement reflects our commitment to being the hands and feet of Jesus in our community.', 'Our students have now contributed over 1,000 volunteer hours this semester, serving local shelters, food banks, and community centers.', '550e8400-e29b-41d4-a716-446655440003', 'news', '/placeholder.jpg');

-- Insert sample events
INSERT INTO public.events (title, description, date, end_date, location, max_attendees, category, created_by) VALUES
  ('Weekly Sabbath Worship', 'Join us for our weekly Sabbath worship service featuring inspiring music, biblical teaching, and fellowship.', '2025-01-25 10:00:00+00', '2025-01-25 12:00:00+00', 'Campus Chapel', 200, 'worship', '550e8400-e29b-41d4-a716-446655440001'),
  ('Prophecy Seminar Series', 'Three-night evangelistic series exploring Bible prophecy and end-time events with Elder Martinez.', '2025-02-01 19:00:00+00', '2025-02-03 21:00:00+00', 'Student Center Auditorium', 300, 'special', '550e8400-e29b-41d4-a716-446655440001'),
  ('Community Food Drive', 'Help us serve the local community by volunteering at the food bank distribution center.', '2025-01-28 09:00:00+00', '2025-01-28 15:00:00+00', 'Local Food Bank', 50, 'outreach', '550e8400-e29b-41d4-a716-446655440003'),
  ('Bible Study: Book of Daniel', 'Deep dive into the prophetic book of Daniel and its relevance for today. All levels welcome.', '2025-01-29 19:00:00+00', '2025-01-29 20:30:00+00', 'Ministry Center', 40, 'study', '550e8400-e29b-41d4-a716-446655440001'),
  ('Youth Game Night', 'Fun evening of games, food, and fellowship for college students. Bring your friends!', '2025-01-30 18:00:00+00', '2025-01-30 21:00:00+00', 'Fellowship Hall', 60, 'fellowship', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample prayer requests
INSERT INTO public.prayer_requests (request, requester_name, requester_email, category, is_anonymous) VALUES
  ('Please pray for my upcoming final exams. I''m struggling with anxiety and need God''s peace and wisdom.', 'Jessica L.', 'jessica.l@student.cbu.edu', 'academic', false),
  ('My family is going through a difficult time with my parents'' divorce. Please pray for healing and reconciliation.', NULL, NULL, 'family', true),
  ('I''m dealing with depression and need prayer for emotional healing and strength to continue my studies.', 'Mark S.', 'mark.s@student.cbu.edu', 'personal', false),
  ('Please pray for our campus ministry outreach events and that many students will be touched by God''s love.', 'Ministry Team', 'ministry@cbusda.org', 'ministry', false),
  ('My grandmother is in the hospital with serious health complications. Please pray for her recovery.', NULL, NULL, 'health', true);

-- Insert sample resources
INSERT INTO public.resources (title, description, type, category, duration, lessons, level, author) VALUES
  ('Prophecies of Daniel', 'A comprehensive study of the prophetic book of Daniel and its relevance for today.', 'bible_study', 'Prophecy', '45 min each', 12, 'intermediate', 'Pastor Johnson'),
  ('The Sanctuary Service', 'Understanding God''s plan of salvation through the Old Testament sanctuary.', 'bible_study', 'Salvation', '60 min each', 8, 'advanced', 'Elder Martinez'),
  ('Steps to Christ', 'A foundational study for new believers based on Ellen White''s classic book.', 'bible_study', 'Christian Living', '30 min each', 10, 'beginner', 'Dr. Emily Chen'),
  ('The Second Coming of Christ', 'Exploring the blessed hope of Christ''s return and how to prepare.', 'sermon', 'End Times', '42 min', NULL, 'intermediate', 'Pastor Johnson'),
  ('Morning Watch Devotional', 'Daily devotional readings for spiritual growth and reflection.', 'devotional', 'Daily Devotions', '10 min', NULL, 'beginner', 'Ministry Team'),
  ('Evangelism Training Manual', 'Complete guide for personal evangelism and witnessing.', 'manual', 'Evangelism', NULL, NULL, 'intermediate', 'Outreach Department');

-- Insert sample gallery items
INSERT INTO public.gallery_items (title, description, image_url, category, event_date, location, attendees, uploaded_by) VALUES
  ('Sabbath Worship Service', 'Weekly Sabbath worship with inspiring music and biblical teaching.', '/KCM_0549.jpg', 'worship', '2025-01-18 10:00:00+00', 'Campus Chapel', 85, '550e8400-e29b-41d4-a716-446655440001'),
  ('Community Food Drive', 'Students volunteering at the local food bank to serve the community.', '/placeholder.jpg', 'outreach', '2025-01-12 09:00:00+00', 'Local Food Bank', 45, '550e8400-e29b-41d4-a716-446655440003'),
  ('New Student Welcome', 'Welcome event for new students with games, food, and fellowship.', '/placeholder.jpg', 'fellowship', '2025-01-10 18:00:00+00', 'Ministry Center', 60, '550e8400-e29b-41d4-a716-446655440004'),
  ('Baptism Ceremony', 'Celebration of faith as five students were baptized into Christ.', '/placeholder.jpg', 'baptisms', '2025-01-08 15:00:00+00', 'Campus Pool', 150, '550e8400-e29b-41d4-a716-446655440001'),
  ('Youth Praise Night', 'Special praise and worship night led by student musicians.', '/placeholder.jpg', 'worship', '2025-01-05 19:00:00+00', 'Campus Chapel', 95, '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample volunteers
INSERT INTO public.volunteers (user_id, committee_id, role, skills, availability, commitment_hours, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.committees WHERE name = 'Worship Committee'), 'Vocalist', ARRAY['Singing', 'Music theory'], 'Weekends', 3, 'active'),
  ('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM public.committees WHERE name = 'Bible Study Committee'), 'Small Group Leader', ARRAY['Teaching', 'Biblical knowledge'], 'Weekday evenings', 4, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.committees WHERE name = 'Media Committee'), 'Social Media Manager', ARRAY['Social media', 'Content creation'], 'Flexible', 2, 'pending');

-- Insert sample counseling requests
INSERT INTO public.counseling_requests (name, email, phone, service_type, preferred_counselor, message, status) VALUES
  ('Anonymous Student', 'student123@cbu.edu', NULL, 'personal', 'Dr. Sarah Johnson', 'I''m struggling with anxiety and depression. I would like to speak with someone about managing these feelings while maintaining my faith.', 'pending'),
  ('Maria Gonzalez', 'maria.g@student.cbu.edu', '(555) 987-6543', 'relationship', 'Pastor Michael Rodriguez', 'I''m having difficulties in my dating relationship and would like biblical guidance on healthy relationships.', 'scheduled'),
  ('James Wilson', 'james.w@student.cbu.edu', '(555) 876-5432', 'academic', 'Dr. Emily Chen', 'The academic pressure is overwhelming and affecting my mental health. I need help developing coping strategies.', 'pending');