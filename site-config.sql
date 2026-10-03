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
