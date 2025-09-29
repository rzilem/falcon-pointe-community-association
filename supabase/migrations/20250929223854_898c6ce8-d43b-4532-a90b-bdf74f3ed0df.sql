-- Fix critical security issues

-- 1. Remove the overly permissive RLS policy that allows authenticated users to read other profiles
DROP POLICY IF EXISTS "Authenticated users can read public profile info" ON public.profiles;

-- 2. Update the admin check function to use the user_roles table instead of profiles.role
-- This provides better separation of concerns and follows security best practices
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user has admin role in user_roles table
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 3. Create a helper function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Add audit fields to track sensitive operations
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS last_updated_ip inet,
ADD COLUMN IF NOT EXISTS last_updated_user_agent text;

ALTER TABLE public.site_images 
ADD COLUMN IF NOT EXISTS last_updated_ip inet,
ADD COLUMN IF NOT EXISTS last_updated_user_agent text;

-- 5. Ensure proper indexing for security functions
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 6. Add trigger to sync admin role between profiles and user_roles tables
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When profile role is updated to admin, ensure user_roles entry exists
  IF NEW.role = 'admin' AND OLD.role != 'admin' THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  -- When profile role is changed from admin, remove user_roles entry
  IF OLD.role = 'admin' AND NEW.role != 'admin' THEN
    DELETE FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile role synchronization
DROP TRIGGER IF EXISTS sync_profile_role_trigger ON public.profiles;
CREATE TRIGGER sync_profile_role_trigger
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role();