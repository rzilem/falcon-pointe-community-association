
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteContent, ContentFilter, ContentSortOptions } from '@/types/content';
import { toast } from 'sonner';

export const useContentManagement = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContent = async (
    filter?: ContentFilter,
    sortOptions?: ContentSortOptions
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('site_content').select('*');
      
      // Apply filters
      if (filter) {
        if (filter.section_type) {
          query = query.eq('section_type', filter.section_type);
        }
        
        if (filter.category) {
          query = query.eq('category', filter.category);
        }
        
        if (filter.active !== undefined) {
          query = query.eq('active', filter.active);
        }
      }
      
      // Apply sorting
      if (sortOptions) {
        query = query.order(sortOptions.field, { ascending: sortOptions.direction === 'asc' });
      } else {
        query = query.order('updated_at', { ascending: false });
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Apply search filter if provided (client-side filtering)
      let filteredData = data || [];
      if (filter?.searchQuery) {
        const searchTerm = filter.searchQuery.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.title?.toLowerCase().includes(searchTerm) || 
          item.section?.toLowerCase().includes(searchTerm) ||
          item.content?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Make sure all returned items have the required section_type field
      const typedData: SiteContent[] = filteredData.map(item => ({
        ...item,
        section_type: (item.section_type || 'static') as 'static' | 'blog' | 'system'
      }));
      
      setContent(typedData);
      return typedData;
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
      toast.error('Failed to load content');
      return [] as SiteContent[];
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (newContent: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .insert(newContent)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Content added successfully');
      return data as SiteContent;
    } catch (err) {
      console.error('Error adding content:', err);
      toast.error('Failed to add content');
      throw err;
    }
  };

  const updateContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Content updated successfully');
      return data as SiteContent;
    } catch (err) {
      console.error('Error updating content:', err);
      toast.error('Failed to update content');
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Content deleted successfully');
    } catch (err) {
      console.error('Error deleting content:', err);
      toast.error('Failed to delete content');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    content,
    loading,
    error,
    isDeleting,
    fetchContent,
    addContent,
    updateContent,
    deleteContent
  };
};
