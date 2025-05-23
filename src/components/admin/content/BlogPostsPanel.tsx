
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useContentManagement } from '@/hooks/useContentManagement';
import { Edit, Trash } from 'lucide-react';
import { SiteContent, ContentSortOptions } from '@/types/content';
import ContentPreview from './ContentPreview';
import ContentForm from './ContentForm';

const BlogPostsPanel: React.FC = () => {
  const { openConfirmation } = useConfirmation();
  const { addContent, updateContent, deleteContent } = useContentManagement();
  
  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [sortField, setSortField] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  
  const { fetchContent } = useContentManagement();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setBlogLoading(true);
      
      // Filter and sort options for blog posts
      const filter = {
        section_type: 'blog' as const,
        searchQuery: filterText,
        active: showPublishedOnly ? true : undefined
      };
      
      const sortOptions = {
        field: sortField as any,
        direction: sortDirection as 'asc' | 'desc'
      };
      
      // Fetch posts using our hook
      const posts = await fetchContent(filter, sortOptions);
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  const handleAddContent = async (newContent: Partial<SiteContent>) => {
    try {
      await addContent(newContent as Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>);
      fetchBlogPosts();
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Blog Post",
      description: "Are you sure you want to delete this blog post? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (contentId) => {
        try {
          await deleteContent(contentId);
          fetchBlogPosts();
        } catch (error) {
          console.error('Error deleting content:', error);
        }
      }
    });
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="space-y-8">
      <ContentForm 
        contentType="blog"
        onSave={handleAddContent}
      />
      
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Blog Posts</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-1/2">
              <Input 
                value={filterText} 
                onChange={(e) => setFilterText(e.target.value)} 
                placeholder="Search by title, content..." 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published-only"
                checked={showPublishedOnly}
                onCheckedChange={setShowPublishedOnly}
              />
              <label htmlFor="published-only">Published only</label>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setFilterText('');
                setShowPublishedOnly(false);
                fetchBlogPosts();
              }}
            >
              Reset
            </Button>
            <Button
              onClick={fetchBlogPosts}
            >
              Search
            </Button>
          </div>
          
          {blogLoading ? (
            <p className="text-center py-4">Loading blog posts...</p>
          ) : blogPosts.length === 0 ? (
            <p className="text-center py-4">No blog posts found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('title')}
                  >
                    Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('category')}
                  >
                    Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('updated_at')}
                  >
                    Last Updated {sortField === 'updated_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title || 'Untitled'}</TableCell>
                    <TableCell>{post.category || 'Uncategorized'}</TableCell>
                    <TableCell>{formatDate(post.updated_at)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${post.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.active ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ContentPreview content={post} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Show content form with this post data
                            alert("Blog post editor will be implemented soon");
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteContent(post.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostsPanel;
