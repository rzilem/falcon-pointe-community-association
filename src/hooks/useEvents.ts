
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_path?: string;
  created_at: string;
  created_by?: string;
  is_featured?: boolean;
  category?: string;
  url?: string;
}

export const useEvents = (options?: {
  featured?: boolean;
  limit?: number;
  category?: string;
  futureOnly?: boolean;
  startDate?: string;
  endDate?: string;
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        // Apply filters based on options
        if (options?.featured) {
          query = query.eq('is_featured', true);
        }
        
        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.futureOnly) {
          const today = new Date().toISOString().split('T')[0];
          query = query.gte('date', today);
        }
        
        if (options?.startDate) {
          query = query.gte('date', options.startDate);
        }
        
        if (options?.endDate) {
          query = query.lte('date', options.endDate);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data && data.length > 0) {
          const eventsWithUrls = data.map(event => {
            let url = undefined;
            if (event.image_path) {
              url = supabase.storage
                .from('event-images')
                .getPublicUrl(event.image_path).data.publicUrl;
            }
            
            return { ...event, url };
          });
          
          setEvents(eventsWithUrls);
        } else {
          setEvents([]);
        }
      } catch (err: any) {
        console.error(`Error fetching events:`, err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [
    options?.featured, 
    options?.limit, 
    options?.category, 
    options?.futureOnly, 
    options?.startDate, 
    options?.endDate
  ]);

  return { events, isLoading, error };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          let url = undefined;
          if (data.image_path) {
            url = supabase.storage
              .from('event-images')
              .getPublicUrl(data.image_path).data.publicUrl;
          }
          
          setEvent({ ...data, url });
        } else {
          setEvent(null);
        }
      } catch (err: any) {
        console.error(`Error fetching event:`, err);
        setError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, isLoading, error };
};
