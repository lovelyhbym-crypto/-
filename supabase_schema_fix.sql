-- ROBUST DATABASE FIX
-- Run this entire script in the Supabase SQL Editor to fix the "Database error" and "auth-code-error"

-- 1. Ensure public.profiles table exists with correct columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Security Fix: Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow users to see their own profile (or all profiles if public)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 4. Fix Trigger Function (handle_new_user)
--    - Addresses duplicate key errors (ON CONFLICT DO NOTHING)
--    - Fixes search_path security warning
--    - Maps metadata correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- SECURITY FIX
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    -- Try to get username from metadata, fallback to email user part, fallback to 'user'
    COALESCE(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- Prevents crash if profile already exists
  return new;
END;
$$;

-- 5. Re-create the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Grant access (just in case)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
