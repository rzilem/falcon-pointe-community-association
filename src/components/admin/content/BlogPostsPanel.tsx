
import React, { useState } from 'react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { SiteContent } from '@/types/content';
import BlogPostEditor from './BlogPostEditor';
import BlogForm from './BlogForm';
import ContentFilters from './ContentFilters';
import BlogPostsTable from './BlogPostsTable';
import AdminPanel from './AdminPanel';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BlogPostsPanel: React.FC = () => {
  const { openConfirmation } = useConfirmation();
  const { isAdmin, user } = useAuth();
  const [editingPost, setEditingPost] = useState<SiteContent | null>(null);
  
  const {
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
  } = useBlogPosts();

  const handleDeleteWithConfirmation = async (id: string) => {
    const postToDelete = blogPosts.find(p => p.id === id);
    const postTitle = postToDelete?.title || 'this blog post';
    
    openConfirmation({
      itemId: id,
      title: "Delete Blog Post",
      description: `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (confirmedId: string) => {
        console.log('Delete confirmation received for:', confirmedId);
        await handleDeleteContent(confirmedId);
      }
    });
  };

  const handleEditPost = (post: SiteContent) => {
    setEditingPost(post);
  };

  const handleCloseEditor = () => {
    setEditingPost(null);
  };

  const handleReset = () => {
    setFilterText('');
    setShowPublishedOnly(false);
    fetchBlogPosts();
  };

  // Show admin status warning if user is not admin
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            You need admin privileges to manage blog posts. Current user: {user?.email || 'Not logged in'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlogForm onSave={handleAddContent} />
      
      <AdminPanel title="Manage Blog Posts">
        <div className="space-y-4">
          <ContentFilters
            filterText={filterText}
            setFilterText={setFilterText}
            showPublishedOnly={showPublishedOnly}
            setShowPublishedOnly={setShowPublishedOnly}
            onReset={handleReset}
            onSearch={fetchBlogPosts}
          />
          
          {loading ? (
            <p className="text-center py-4">Loading blog posts...</p>
          ) : blogPosts.length === 0 ? (
            <p className="text-center py-4">No blog posts found</p>
          ) : (
            <BlogPostsTable
              posts={blogPosts}
              sortField={sortField}
              sortDirection={sortDirection}
              deleting={deleting}
              onSortChange={handleSortChange}
              onEdit={handleEditPost}
              onDelete={handleDeleteWithConfirmation}
            />
          )}
        </div>
      </AdminPanel>

      {editingPost && (
        <BlogPostEditor
          post={editingPost}
          isOpen={!!editingPost}
          onClose={handleCloseEditor}
          onSave={handleUpdateContent}
        />
      )}
    </div>
  );
};

export default BlogPostsPanel;
