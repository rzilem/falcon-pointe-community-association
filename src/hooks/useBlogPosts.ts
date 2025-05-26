
import { useState, useEffect } from 'react';
import { useContentManagement } from './useContentManagement';
import { SiteContent } from '@/types/content';
import { toast } from 'sonner';

export const useBlogPosts = () => {
  const { fetchContent, addContent, updateContent, deleteContent } = useContentManagement();
  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
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
      console.log('Starting delete for blog post:', id);
      setDeleting(id);
      
      await deleteContent(id);
      
      // Remove the deleted post from local state immediately
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      
      console.log('Blog post deleted successfully:', id);
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      
      // Show specific error message based on the error type
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          toast.error('Permission denied: You must be an admin to delete blog posts');
        } else if (error.message.includes('violates foreign key')) {
          toast.error('Cannot delete: This blog post is referenced by other content');
        } else {
          toast.error(`Failed to delete blog post: ${error.message}`);
        }
      } else {
        toast.error('Failed to delete blog post. Please try again.');
      }
      
      // Refresh the list to ensure consistency
      fetchBlogPosts();
    } finally {
      setDeleting(null);
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
    deleting,
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
