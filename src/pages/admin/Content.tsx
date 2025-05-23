
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteContent } from '@/types/content';
import ContentForm from '@/components/admin/content/ContentForm';
import ContentEditor from '@/components/admin/content/ContentEditor';
import CategoryManager from '@/components/admin/content/CategoryManager';
import ContentPreview from '@/components/admin/content/ContentPreview';
import { useContentManagement } from '@/hooks/useContentManagement';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, Calendar, Tag, Edit, Trash, Eye } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useConfirmation } from '@/hooks/useConfirmation';

const Content = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const { 
    content, 
    loading, 
    fetchContent, 
    addContent, 
    updateContent, 
    deleteContent 
  } = useContentManagement();

  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('static');
  const [sortField, setSortField] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  
  const {
    isConfirmationOpen,
    openConfirmation,
    closeConfirmation,
    handleConfirmAction,
    confirmationTitle,
    confirmationDescription,
    confirmationVariant,
    confirmationButtonLabel,
    cancelButtonLabel
  } = useConfirmation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchContentData();
    }
  }, [isAdmin, navigate]);

  const fetchContentData = () => {
    // Use our hook to fetch both content types
    fetchContent({ section_type: 'static' });
    fetchBlogPosts();
  };

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
      // Create required properties for the content
      const contentToAdd = {
        ...newContent,
        section_type: activeTab === 'blog' ? 'blog' as const : 'static' as const,
        section: newContent.section || 'general',
        title: newContent.title || null,
        content: newContent.content || null,
        active: newContent.active !== undefined ? newContent.active : true,
        last_updated_by: user?.id || null
      } as Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>;
      
      await addContent(contentToAdd);
      fetchContentData();
      toast.success('Content added successfully');
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      await updateContent(id, updates);
      fetchContentData();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Content",
      description: "Are you sure you want to delete this content? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (contentId) => {
        try {
          await deleteContent(contentId);
          fetchContentData();
        } catch (error) {
          console.error('Error deleting content:', error);
        }
      }
    });
  };

  const handleToggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  // Group content by section
  const contentBySection = content.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="static">Static Content</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="static" className="space-y-8">
            <ContentForm 
              contentType="static"
              onSave={handleAddContent}
            />
            
            <div className="border rounded-md p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Static Content</h2>
              
              {loading ? (
                <p className="text-center py-4">Loading content...</p>
              ) : Object.keys(contentBySection).length === 0 ? (
                <p className="text-center py-4">No content found</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(contentBySection).map(([section, items]) => (
                    <Collapsible 
                      key={section}
                      open={openSections.includes(section)}
                      onOpenChange={() => handleToggleSection(section)}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="flex w-full justify-between p-4"
                        >
                          <span>{section}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(section) ? 'transform rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 space-y-4">
                        {items.map((item) => (
                          <ContentEditor 
                            key={item.id}
                            content={item}
                            onUpdate={handleUpdateContent}
                            onDelete={handleDeleteContent}
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-8">
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
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationTitle}
        description={confirmationDescription}
        confirmLabel={confirmationButtonLabel}
        cancelLabel={cancelButtonLabel}
        variant={confirmationVariant}
      />
    </div>
  );
};

export default Content;
