-- =====================================================================
-- MEC EVENT PORTAL - SUPABASE SQL SETUP SCRIPT
-- =====================================================================
-- Copy and paste this entire script into your Supabase project's SQL Editor
-- (Database -> SQL Editor -> New Query -> Paste -> Run).
-- =====================================================================

-- 1. Create User Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  email text,
  semester text,
  branch text,
  student_id text,
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Event Registrations Table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id text not null,
  event_title text not null,
  event_date text not null,
  event_time text not null,
  event_venue text not null,
  club_name text not null,
  ticket_id text not null,
  full_name text not null,
  email text not null,
  semester text not null,
  branch text not null,
  student_id text not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row-Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.registrations enable row level security;

-- 4. RLS Policies for Profiles Table
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow users to update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Allow users to insert their own profile (Fallback)" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 5. RLS Policies for Registrations Table
create policy "Allow users to view their own registrations" 
  on public.registrations for select 
  using (auth.uid() = user_id);

create policy "Allow users to insert their own registrations" 
  on public.registrations for insert 
  with check (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, is_complete)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    new.email,
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
