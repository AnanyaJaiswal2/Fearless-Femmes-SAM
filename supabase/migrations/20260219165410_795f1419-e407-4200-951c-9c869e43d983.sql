
-- Create reports table for unsafe area reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  anonymous BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reports (anonymous reporting)
CREATE POLICY "Anyone can submit reports"
ON public.reports FOR INSERT
WITH CHECK (true);

-- Allow anyone to read reports (for heatmap data)
CREATE POLICY "Anyone can view reports"
ON public.reports FOR SELECT
USING (true);

-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true);

-- Allow anyone to upload report images
CREATE POLICY "Anyone can upload report images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'report-images');

-- Allow anyone to view report images
CREATE POLICY "Anyone can view report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');
