
import React, { useState } from 'react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { SiteContent } from '@/types/content';
import BlogPostEditor from './BlogPostEditor';
import BlogForm from './BlogForm';
import ContentFilters from './ContentFilters';
import BlogPostsTable from './BlogPostsTable';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const BlogPostsPanel: React.FC = () => {
  const { openConfirmation } = useConfirmation();
  const [editingPost, setEditingPost] = useState<SiteContent | null>(null);
  
  const {
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
  } = useBlogPosts();

  const handleDeleteWithConfirmation = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Blog Post",
      description: "Are you sure you want to delete this blog post? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: handleDeleteContent
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

  return (
    <div className="space-y-8">
      <BlogForm onSave={handleAddContent} />
      
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Blog Posts</h2>
        
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
              onSortChange={handleSortChange}
              onEdit={handleEditPost}
              onDelete={handleDeleteWithConfirmation}
            />
          )}
        </div>
      </div>

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
