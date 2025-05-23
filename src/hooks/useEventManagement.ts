
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  image_path: string | null;
  is_featured: boolean;
  category: string | null;
  created_at: string;
  created_by: string | null;
}

export interface EventFilter {
  category?: string;
  isFeatured?: boolean;
  searchQuery?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export type EventSortField = 'title' | 'date' | 'created_at' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface EventSortOptions {
  field: EventSortField;
  direction: SortDirection;
}

export const useEventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async (
    filter?: EventFilter,
    sortOptions?: EventSortOptions
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('events').select('*');
      
      // Apply filters
      if (filter) {
        if (filter.category && filter.category !== 'all') {
          query = query.eq('category', filter.category);
        }
        
        if (filter.isFeatured !== undefined) {
          query = query.eq('is_featured', filter.isFeatured);
        }
        
        if (filter.dateRange?.start) {
          query = query.gte('date', filter.dateRange.start.toISOString().split('T')[0]);
        }
        
        if (filter.dateRange?.end) {
          query = query.lte('date', filter.dateRange.end.toISOString().split('T')[0]);
        }
      }
      
      // Apply sorting
      if (sortOptions) {
        query = query.order(sortOptions.field, { ascending: sortOptions.direction === 'asc' });
      } else {
        query = query.order('date', { ascending: true });
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Apply search filter if provided (client-side filtering)
      let filteredData = data || [];
      if (filter?.searchQuery) {
        const searchTerm = filter.searchQuery.toLowerCase();
        filteredData = filteredData.filter(event => 
          event.title.toLowerCase().includes(searchTerm) || 
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm)
        );
      }
      
      setEvents(filteredData);
      return filteredData;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      toast.error('Failed to load events');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (newEvent: Omit<Event, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Event added successfully');
      return data;
    } catch (err) {
      console.error('Error adding event:', err);
      toast.error('Failed to add event');
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Event updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const getEventById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error(`Error fetching event with id ${id}:`, err);
      toast.error('Failed to load event');
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    isDeleting,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
  };
};
