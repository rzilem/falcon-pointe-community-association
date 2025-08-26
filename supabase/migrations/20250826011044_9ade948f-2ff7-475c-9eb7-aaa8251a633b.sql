-- Fix function search path security warnings

-- Update existing functions to have secure search_path
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF title IS NULL OR title = '' THEN
    RETURN '';
  END IF;
  
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          trim(title),
          '\s+', '-', 'g'  -- Replace spaces with hyphens
        ),
        '[^a-z0-9-]', '', 'g'  -- Remove special characters
      ),
      '-+', '-', 'g'  -- Replace multiple hyphens with single
    )
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Only generate slug for blog posts with titles
  IF NEW.section_type = 'blog' AND NEW.title IS NOT NULL THEN
    -- If no slug provided or slug is empty, generate one
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
      NEW.slug = public.generate_slug(NEW.title);
    END IF;
    
    -- Ensure slug uniqueness by appending number if needed
    WHILE EXISTS (
      SELECT 1 FROM public.site_content 
      WHERE slug = NEW.slug 
      AND section_type = 'blog' 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) LOOP
      NEW.slug = NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE 
      -- Initially set first user as admin - you can modify this logic as needed
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE(
  id uuid,
  username text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.id, p.username
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;