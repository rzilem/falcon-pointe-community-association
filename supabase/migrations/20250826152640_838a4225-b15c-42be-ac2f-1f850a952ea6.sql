
-- 1) Allow authenticated users to insert their own profile row
--    (so profiles can be created from the client when needed)
create policy if not exists "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- 2) Ensure a profile exists for the user with the given email and set admin role
-- Insert a profile if missing
insert into public.profiles (id, role, username, full_name, avatar_url)
select
  u.id,
  'admin'::text as role,
  split_part(u.email, '@', 1) as username,
  null::text as full_name,
  null::text as avatar_url
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'rzilem@gmail.com'
  and p.id is null;

-- Update role to admin (covers the case where a profile row already exists)
update public.profiles
set role = 'admin',
    updated_at = now()
where id in (
  select id from auth.users where email = 'rzilem@gmail.com'
);
