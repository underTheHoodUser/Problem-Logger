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
