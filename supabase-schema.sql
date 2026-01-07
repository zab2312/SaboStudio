-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT, -- Kratki opis koji se prikazuje na početnoj stranici
  full_description TEXT, -- Cijeli opis s HTML formatiranjem koji se prikazuje na detail stranici
  technologies TEXT[] NOT NULL,
  development_time VARCHAR(100) NOT NULL,
  website_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add new columns to existing projects table (if table already exists)
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS full_description TEXT;

-- Client testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Appointments/Reservations table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Working hours settings table
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL, -- 0 = Monday, 6 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(day_of_week)
);

-- Insert default working hours (Monday-Friday 9:00-17:00)
INSERT INTO working_hours (day_of_week, start_time, end_time, is_available) VALUES
  (0, '09:00:00', '17:00:00', true), -- Monday
  (1, '09:00:00', '17:00:00', true), -- Tuesday
  (2, '09:00:00', '17:00:00', true), -- Wednesday
  (3, '09:00:00', '17:00:00', true), -- Thursday
  (4, '09:00:00', '17:00:00', true)  -- Friday
ON CONFLICT (day_of_week) DO NOTHING;

-- Audit requests table (for free website analysis requests)
CREATE TABLE IF NOT EXISTS audit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_audit_requests_status ON audit_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_requests_created ON audit_requests(created_at);

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies (allow public read, authenticated write)
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images');

