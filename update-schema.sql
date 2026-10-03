-- Add author_name to problems
ALTER TABLE public.problems ADD COLUMN author_name text DEFAULT 'Anonymous';

-- Create comments table
CREATE TABLE public.comments (
  id uuid default gen_random_uuid() primary key,
  problem_id uuid references public.problems(id) on delete cascade not null,
  content text not null,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.comments FOR INSERT WITH CHECK (true);
