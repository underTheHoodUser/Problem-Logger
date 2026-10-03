-- Run this SQL in your Supabase SQL Editor to create the tables

create table public.problems (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  level text not null check (level in ('dhoom', 'chuddi', 'dhoom_chuddi')),
  upvotes integer default 0 not null,
  downvotes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.problems enable row level security;

-- Create policies for public access (since this is an anonymous app)
create policy "Enable read access for all users" on public.problems
  for select using (true);

create policy "Enable insert access for all users" on public.problems
  for insert with check (true);

create policy "Enable update for votes" on public.problems
  for update using (true);
-- Run this in your Supabase SQL Editor to allow authenticated users (Admins) to delete problems:
create policy "Enable delete for authenticated users only" on public.problems
  for delete using (auth.role() = 'authenticated');
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
-- Run this in your Supabase SQL Editor to add the ip_address tracking column
alter table public.problems add column ip_address text;
create table public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.subscribers enable row level security;

-- Public can insert (subscribe)
create policy "Enable insert for anyone" on public.subscribers
  for insert with check (true);

-- Only admins can read the list of subscribers
create policy "Enable read for admins" on public.subscribers
  for select using (auth.role() = 'authenticated');
-- 1. Add verification columns. Default existing subscribers to 'true' so they don't break.
alter table public.subscribers add column is_verified boolean default true not null;
alter table public.subscribers add column verify_token uuid default gen_random_uuid() not null;

-- 2. Change the default so NEW subscribers are false by default
alter table public.subscribers alter column is_verified set default false;
create table public.site_config (
  id text primary key,
  data jsonb not null
);

-- Turn on Row Level Security
alter table public.site_config enable row level security;

-- Public can read
create policy "Enable public read" on public.site_config
  for select using (true);

-- Admins can update
create policy "Enable admin update" on public.site_config
  for update using (auth.role() = 'authenticated');
  
-- Admins can insert
create policy "Enable admin insert" on public.site_config
  for insert with check (auth.role() = 'authenticated');
