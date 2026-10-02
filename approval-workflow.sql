-- 1. Add the is_approved column (defaults to false so new problems are hidden by default)
alter table public.problems add column is_approved boolean default false not null;

-- 2. Drop the old public read policy (so public can't see everything anymore)
drop policy if exists "Enable read access for all users" on public.problems;

-- 3. Create new public read policy (Public users can ONLY see approved problems)
create policy "Enable read access for approved problems" on public.problems
  for select using (is_approved = true);

-- 4. Create admin read policy (Admins can see ALL problems to review them)
create policy "Enable read access for admins" on public.problems
  for select using (auth.role() = 'authenticated');

-- 5. Drop the old public vote update policy
drop policy if exists "Enable update for votes" on public.problems;

-- 6. Create new public vote policy (Public can only vote on approved problems)
create policy "Enable public updates for votes on approved problems" on public.problems
  for update using (is_approved = true);

-- 7. Create admin update policy (Admins can update problems, e.g. setting is_approved to true)
create policy "Enable full updates for admins" on public.problems
  for update using (auth.role() = 'authenticated');
