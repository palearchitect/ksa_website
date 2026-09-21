-- ========================================================
-- Supabase Quickstart SQL Setup for KSA Valuers & Instruments
-- Run this in your Supabase SQL Editor (database.new)
-- ========================================================

-- 1. Create the instruments table
create table if not exists instruments (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Insert sample instrument data
insert into instruments (name)
values
  ('Violin'),
  ('Viola'),
  ('Cello'),
  ('Double Bass')
on conflict do nothing;

-- 3. Enable Row Level Security (RLS)
alter table instruments enable row level security;

-- 4. Create RLS policy for public read access
create policy "Allow public read access to instruments" 
  on instruments 
  for select 
  using (true);
