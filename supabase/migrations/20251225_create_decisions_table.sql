-- Create decisions table
create table if not exists public.decisions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  winner_name text not null,
  winner_character int not null,
  options jsonb not null,
  created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.decisions enable row level security;

-- Policy: Users can insert their own decisions
create policy "Users can insert their own decisions"
  on public.decisions for insert
  with check (auth.uid() = user_id);

-- Policy: Users can view their own decisions
create policy "Users can view their own decisions"
  on public.decisions for select
  using (auth.uid() = user_id);
