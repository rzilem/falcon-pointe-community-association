-- Remove public read access from messages table
DROP POLICY IF EXISTS "Anyone can create a new message" ON public.messages;

-- Create secure policies for messages table
CREATE POLICY "Anyone can insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can read messages" 
ON public.messages 
FOR SELECT 
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can update messages" 
ON public.messages 
FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can delete messages" 
ON public.messages 
FOR DELETE 
USING (public.is_current_user_admin());