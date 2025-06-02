
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
      
      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }
      
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
      
      console.log(`Fetched ${typedData.length} content items`);
      setContent(typedData);
      return typedData;
    } catch (err) {
      console.error('Error fetching content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMessage);
      toast.error(errorMessage);
      return [] as SiteContent[];
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (newContent: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding content:', newContent);
      
      const { data, error } = await supabase
        .from('site_content')
        .insert(newContent)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Content added successfully:', data);
      toast.success('Content added successfully');
      return data as SiteContent;
    } catch (err) {
      console.error('Error adding content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add content';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      console.log('Updating content:', id, updates);
      
      const { data, error } = await supabase
        .from('site_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Content updated successfully:', data);
      toast.success('Content updated successfully');
      return data as SiteContent;
    } catch (err) {
      console.error('Error updating content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      console.log('Attempting to delete content with ID:', id);
      setIsDeleting(true);
      
      // Check current user and admin status
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        throw new Error('You must be logged in to delete content');
      }
      
      // Check admin status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      console.log('User profile:', profile);
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Unable to verify admin permissions');
      }
      
      if (profile?.role !== 'admin') {
        throw new Error('You must be an admin to delete content');
      }
      
      // First verify the content exists
      const { data: existingContent, error: fetchError } = await supabase
        .from('site_content')
        .select('id, title')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching content before delete:', fetchError);
        if (fetchError.code === 'PGRST116') {
          throw new Error('Content not found');
        }
        throw fetchError;
      }
      
      console.log('Content found, proceeding with delete:', existingContent);
      
      // Proceed with deletion
      const { error: deleteError } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        
        // Provide specific error messages based on error codes
        if (deleteError.code === '42501') {
          throw new Error('Permission denied: Admin privileges required to delete content');
        } else if (deleteError.code === '23503') {
          throw new Error('Cannot delete: This content is referenced by other items');
        } else {
          throw new Error(`Delete failed: ${deleteError.message}`);
        }
      }
      
      console.log('Content deleted successfully:', id);
      toast.success('Content deleted successfully');
    } catch (err) {
      console.error('Error deleting content:', err);
      
      // Show specific error message to user
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to delete content. Please try again.');
      }
      
      // Re-throw the error so the calling component can handle it
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
