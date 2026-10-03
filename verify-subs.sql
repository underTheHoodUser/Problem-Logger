-- 1. Add verification columns. Default existing subscribers to 'true' so they don't break.
alter table public.subscribers add column is_verified boolean default true not null;
alter table public.subscribers add column verify_token uuid default gen_random_uuid() not null;

-- 2. Change the default so NEW subscribers are false by default
alter table public.subscribers alter column is_verified set default false;
