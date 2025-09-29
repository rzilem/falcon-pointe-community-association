import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  successMessage?: string;
}

export const useSecureSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitContactForm = async (
    data: { name: string; email: string; subject: string; message: string },
    options?: SubmitOptions
  ) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('secure-contact', {
        body: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          origin: window.location.origin
        }
      });

      if (error) {
        console.error('Contact form submission error:', error);
        throw new Error(error.message || 'Failed to send message');
      }

      toast.success(options?.successMessage || "Message sent successfully!");
      options?.onSuccess?.();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('Contact form error:', errorMessage);
      toast.error(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitContactForm,
    isLoading
  };
};