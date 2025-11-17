-- Grant admin rights to stephanie@psprop.net
UPDATE profiles 
SET role = 'admin', updated_at = now()
WHERE id = '9dc4afd8-e44c-4084-94e1-f427e2a0c4ad';

-- The sync_profile_role trigger will automatically add the admin role to user_roles table