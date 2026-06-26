-- DentalJournal.online Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mbbjxqwpbecreqjsggpe/sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Dental Health',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  reads INTEGER NOT NULL DEFAULT 0,
  reads_per_day INTEGER NOT NULL DEFAULT 12,
  reads_started_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published, published_at DESC);

-- Page SEO settings (admin-editable)
CREATE TABLE IF NOT EXISTS page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Write for us submissions
CREATE TABLE IF NOT EXISTS write_for_us_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  bio TEXT,
  sample_url TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE write_for_us_submissions ENABLE ROW LEVEL SECURITY;

-- Public read published posts
CREATE POLICY "Public read published posts" ON posts
  FOR SELECT USING (published = true);

-- Service role bypasses RLS; for anon key allow public inserts on newsletter/contact/write_for_us
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert write for us" ON write_for_us_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read page seo" ON page_seo
  FOR SELECT USING (true);

-- Seed default page SEO
INSERT INTO page_seo (page_path, meta_title, meta_description, meta_keywords) VALUES
  ('/', 'DentalJournal.online | Dental Health Blog & Expert Articles', 'Read expert dental health articles, oral care tips, and patient-friendly guides written by dental professionals.', 'dental blog, oral health, dental care tips, dentistry articles'),
  ('/blog', 'Articles | DentalJournal.online', 'Browse our latest dental health articles, oral hygiene guides, and expert dental advice.', 'dental articles, oral health blog, dental tips'),
  ('/about', 'About Us | DentalJournal.online', 'Learn about DentalJournal.online — a trusted dental health blog sharing practical advice for patients and professionals.', 'about dental blog, dental health writers'),
  ('/contact', 'Contact | DentalJournal.online', 'Get in touch with the DentalJournal.online team for questions, partnerships, or feedback.', 'contact dental blog'),
  ('/write-for-us', 'Write For Us | DentalJournal.online', 'Contribute dental health articles to DentalJournal.online. Submit your story idea and join our writer community.', 'write for us dental, guest post dentistry')
ON CONFLICT (page_path) DO NOTHING;

-- Seed admin (password: admin123) - bcrypt hash
INSERT INTO users (email, password_hash, name) VALUES
  ('admin@dentaljournal.online', '$2b$12$IJovtzUE8q46gSWfXyoS/.B.gf4ZCFEkvwqq01yKZLRyHE68CiZFu', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Seed sample blog posts
INSERT INTO posts (title, slug, excerpt, content, author, category, published, featured, published_at) VALUES
  (
    '10 Daily Habits for Healthier Teeth and Gums',
    '10-daily-habits-healthier-teeth-gums',
    'Simple everyday routines that protect your smile and prevent common dental problems before they start.',
    '<p>Good oral health starts with consistent daily habits. Brushing twice a day, flossing once, and choosing water over sugary drinks can dramatically reduce your risk of cavities and gum disease.</p><h2>Morning Routine</h2><p>Brush for two full minutes with fluoride toothpaste. Don''t rinse immediately — let the fluoride work.</p><h2>Evening Care</h2><p>Floss before brushing to remove plaque between teeth where brushes can''t reach.</p>',
    'Dr. Sarah Mitchell',
    'Oral Care',
    true, true, NOW() - INTERVAL '3 days'
  ),
  (
    'What to Expect at Your First Dental Checkup in Years',
    'first-dental-checkup-after-years',
    'Nervous about returning to the dentist? Here''s exactly what happens and how to feel confident going back.',
    '<p>It''s common to skip dental visits during busy seasons of life. When you return, your dentist will focus on making you comfortable while assessing your current oral health.</p><p>Expect X-rays if needed, a gentle cleaning, and an honest conversation about next steps — no judgment, just care.</p>',
    'Dr. James Chen',
    'Patient Guide',
    true, true, NOW() - INTERVAL '7 days'
  ),
  (
    'Electric vs Manual Toothbrushes: Which Is Better?',
    'electric-vs-manual-toothbrush',
    'We break down the research so you can choose the brush that fits your budget and brushing style.',
    '<p>Both electric and manual toothbrushes can be effective when used correctly. Electric brushes may help people with limited mobility and those who tend to brush too hard.</p><p>The best brush is the one you''ll use consistently for two minutes, twice a day.</p>',
    'Dr. Elena Rodriguez',
    'Products',
    true, false, NOW() - INTERVAL '14 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- If tables already exist, run this migration to add reads columns:
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads_per_day INTEGER NOT NULL DEFAULT 12;
-- ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads_started_at TIMESTAMPTZ;
-- UPDATE posts SET reads_started_at = COALESCE(published_at, created_at) WHERE reads_started_at IS NULL;
