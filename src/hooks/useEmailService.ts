
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async ({ to, subject, html, text }: SendEmailParams) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html, text },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Email sent successfully',
        description: `Email was sent to ${to}`,
      });

      return { success: true, data };
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError(err.message);
      
      toast({
        variant: 'destructive',
        title: 'Failed to send email',
        description: err.message,
      });
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    // Using Supabase's built-in password reset functionality
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('Error sending password reset:', error);
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: error.message,
      });
      return { success: false, error: error.message };
    }

    toast({
      title: 'Password reset email sent',
      description: 'Please check your inbox for further instructions',
    });
    
    return { success: true };
  };

  return {
    sendEmail,
    sendPasswordResetEmail,
    loading,
    error,
  };
};
