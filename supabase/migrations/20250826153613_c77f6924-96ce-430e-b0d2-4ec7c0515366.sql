
-- 1) Allow authenticated users to insert their own profile
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- 2) Ensure the recreated user has an admin profile
insert into public.profiles (id, username, full_name, role)
values ('34d308b9-a163-4e60-9c0a-2b8dbb856de7'::uuid, 'rzilem', null, 'admin')
on conflict (id) do update
set role = 'admin',
    updated_at = now();
