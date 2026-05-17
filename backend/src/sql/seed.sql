-- Optional starter data. 
INSERT INTO public.programs (title, slug, description, category, meeting_time, meeting_location, leader_name)
VALUES
('Weekly Bible Study','weekly-bible-study','A weekly study group for spiritual growth and biblical understanding.','discipleship','Wednesday 18:00','CBU Campus','PCM Leadership'),
('Campus Outreach','campus-outreach','Outreach and service activities for the campus community.','outreach','Saturday 14:00','CBU Campus','PCM Outreach Team')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.resources (title, slug, description, type, category, author, level, status)
VALUES
('Bible Study Guide','bible-study-guide','Starter Bible study resource. Upload the actual PDF or article before launch.','bible_study','Bible Study','CBU SDA PCM','beginner','published')
ON CONFLICT (slug) DO NOTHING;
