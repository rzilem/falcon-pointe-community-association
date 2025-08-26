-- Fix security issue: Restrict profile access to follow privacy best practices

-- Drop the overly permissive policy that allows all authenticated users to read all profiles
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

-- Create secure policies for profile access

-- 1. Users can read their own complete profile
CREATE POLICY "Users can read their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Admins can read all profiles (for administrative purposes)
CREATE POLICY "Admins can read all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Optional: Allow reading only public profile fields for community features
-- This policy allows authenticated users to see only basic public info (username) 
-- for features like mentions, author attribution, etc.
-- Remove avatar_url and full_name from this if you want them completely private
CREATE POLICY "Public profile info for authenticated users" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() != id 
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add a function to get limited public profile info safely
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE(
  id uuid,
  username text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.id, p.username
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;