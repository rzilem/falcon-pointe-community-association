
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/message';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      setMessages(data as Message[]);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMessageStatus = useCallback(async (
    messageId: string, 
    updates: Partial<Message>
  ) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', messageId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Return success
      return true;
    } catch (err: any) {
      console.error('Error updating message:', err);
      throw new Error('Failed to update message');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { 
    messages, 
    isLoading, 
    error, 
    refreshMessages: fetchMessages,
    updateMessageStatus
  };
};

export const useUnreadMessagesCount = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { count: unreadCount, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('read_status', false);
      
      if (countError) {
        throw countError;
      }
      
      setCount(unreadCount || 0);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
      setError('Failed to load unread count');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCount();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, () => {
        fetchCount();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCount]);

  return { count, isLoading, error, refresh: fetchCount };
};
