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
