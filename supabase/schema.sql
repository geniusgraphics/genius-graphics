-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Covers (seeded from the static data, but DB is the source of truth for sold state)
create table if not exists covers (
  id text primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  description text,
  image_file text not null,
  video_count int default 0,
  price_image decimal(10,2) not null,
  price_with_videos decimal(10,2),
  sold boolean default false,
  sold_at timestamptz,
  sold_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- User profiles (extends Supabase auth.users)
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Purchases
create table if not exists purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  cover_id text references covers(id) not null,
  purchase_type text not null check (purchase_type in ('image_only', 'with_videos')),
  amount_paid decimal(10,2) not null,
  stripe_payment_id text,
  video_upgrade_deadline timestamptz,
  download_token uuid default gen_random_uuid(),
  download_token_used boolean default false,
  created_at timestamptz default now()
);

-- Saved covers
create table if not exists saved_covers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  cover_id text references covers(id) not null,
  created_at timestamptz default now(),
  unique(user_id, cover_id)
);

-- Recently viewed (keep only last 10 per user; profile shows last 4)
create table if not exists recently_viewed (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  cover_id text references covers(id) not null,
  viewed_at timestamptz default now()
);

-- RLS policies
alter table covers enable row level security;
alter table user_profiles enable row level security;
alter table purchases enable row level security;
alter table saved_covers enable row level security;
alter table recently_viewed enable row level security;

-- Covers: anyone can read
create policy "covers_public_read" on covers for select using (true);

-- User profiles: users manage their own
create policy "profiles_self" on user_profiles
  for all using (auth.uid() = id);

-- Purchases: users see own
create policy "purchases_self" on purchases
  for select using (auth.uid() = user_id);

-- Saved: users manage own
create policy "saved_self" on saved_covers
  for all using (auth.uid() = user_id);

-- Recently viewed: users manage own
create policy "viewed_self" on recently_viewed
  for all using (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
