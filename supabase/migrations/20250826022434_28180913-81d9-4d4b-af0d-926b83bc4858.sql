-- Fix infinite recursion in profiles table RLS policies
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profile info for authenticated users" ON public.profiles;

-- Create a secure function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$function$;

-- Create new secure RLS policies for profiles
CREATE POLICY "Admins can read all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Authenticated users can read public profile info" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() != id);

-- Harden documents table - only admins can modify
DROP POLICY IF EXISTS "Authenticated Users Can Insert Document Metadata" ON public.documents;
DROP POLICY IF EXISTS "Authenticated Users Can Update Document Metadata" ON public.documents;
DROP POLICY IF EXISTS "Authenticated Users Can Delete Document Metadata" ON public.documents;

CREATE POLICY "Only admins can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Only admins can update documents" 
ON public.documents 
FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can delete documents" 
ON public.documents 
FOR DELETE 
USING (public.is_current_user_admin());

-- Improve auth settings
UPDATE auth.config 
SET 
  otp_exp = 300,  -- 5 minutes instead of default 1 hour
  password_min_length = 8,
  enable_signup_limit = true,
  enable_password_strength = true
WHERE TRUE;