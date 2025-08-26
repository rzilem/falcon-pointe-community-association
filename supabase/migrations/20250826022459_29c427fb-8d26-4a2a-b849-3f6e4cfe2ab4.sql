-- Fix infinite recursion in profiles table RLS policies
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profile info for authenticated users" ON public.profiles;

-- The is_current_user_admin function already exists, so we'll use it

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

-- Make association_documents bucket private for sensitive documents
UPDATE storage.buckets 
SET public = false 
WHERE id = 'association_documents';