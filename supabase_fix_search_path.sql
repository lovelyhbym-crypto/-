-- Supabase Security Advisor Fix: Explicitly set search_path
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- Fix: Explicitly set search_path to public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$;
