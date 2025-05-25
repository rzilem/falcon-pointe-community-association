
import { useState, useEffect } from 'react';
import { useContentManagement } from './useContentManagement';
import { SiteContent } from '@/types/content';
import { toast } from 'sonner';

export const useBlogPosts = () => {
  const { fetchContent, addContent, updateContent, deleteContent } = useContentManagement();
  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      const filter = {
        section_type: 'blog' as const,
        searchQuery: filterText,
        active: showPublishedOnly ? true : undefined
      };
      
      const sortOptions = {
        field: sortField as any,
        direction: sortDirection as 'asc' | 'desc'
      };
      
      const posts = await fetchContent(filter, sortOptions);
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (newContent: Partial<SiteContent>) => {
    try {
      await addContent(newContent as Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>);
      fetchBlogPosts();
      toast.success('Blog post added successfully');
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add blog post');
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      await updateContent(id, updates);
      fetchBlogPosts();
      toast.success('Blog post updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update blog post');
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id);
      fetchBlogPosts();
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return {
    blogPosts,
    loading,
    sortField,
    sortDirection,
    filterText,
    setFilterText,
    showPublishedOnly,
    setShowPublishedOnly,
    fetchBlogPosts,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    handleSortChange
  };
};
