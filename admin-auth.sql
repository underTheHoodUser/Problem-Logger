-- Run this in your Supabase SQL Editor to allow authenticated users (Admins) to delete problems:
create policy "Enable delete for authenticated users only" on public.problems
  for delete using (auth.role() = 'authenticated');
