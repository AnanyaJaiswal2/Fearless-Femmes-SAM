
-- Create scholarships table (public data)
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  deadline TEXT,
  benefits TEXT,
  apply_link TEXT,
  category TEXT DEFAULT 'Women-specific',
  level TEXT DEFAULT 'UG',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scholarships are publicly viewable"
ON public.scholarships FOR SELECT USING (true);

-- Create internships table (public data)
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT DEFAULT 'India',
  stipend TEXT,
  apply_link TEXT,
  posted_date TEXT,
  work_type TEXT DEFAULT 'On-site',
  field TEXT DEFAULT 'Tech',
  is_women_focused BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internships are publicly viewable"
ON public.internships FOR SELECT USING (true);
