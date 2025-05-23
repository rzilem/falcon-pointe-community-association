
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Calendar, Clock, Tag, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  active: boolean;
  updated_at: string;
  created_at: string;
  last_updated_by: string | null;
}

const Content = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('static');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [sortField, setSortField] = useState('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchContent();
      fetchBlogPosts();
    }
  }, [isAdmin, navigate]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'static')
        .order('section', { ascending: true });
      
      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setBlogLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;

      let filteredData = data || [];
      
      if (filterText) {
        filteredData = filteredData.filter(post => 
          post.title?.toLowerCase().includes(filterText.toLowerCase()) || 
          post.section?.toLowerCase().includes(filterText.toLowerCase()) ||
          post.content?.toLowerCase().includes(filterText.toLowerCase())
        );
      }
      
      if (showPublishedOnly) {
        filteredData = filteredData.filter(post => post.active);
      }
      
      setBlogPosts(filteredData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setBlogLoading(false);
    }
  };

  const handleAddContent = async () => {
    if (!newSection) {
      toast.error('Please enter a section name');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_content')
        .insert({
          section: newSection,
          title: newTitle || null,
          content: newContent || null,
          last_updated_by: user?.id,
          section_type: activeTab === 'blog' ? 'blog' : 'static',
          category: activeTab === 'blog' ? newCategory : null
        });
      
      if (error) throw error;
      
      toast.success('Content added successfully');
      setNewSection('');
      setNewTitle('');
      setNewContent('');
      setNewCategory('general');
      
      if (activeTab === 'static') {
        fetchContent();
      } else {
        fetchBlogPosts();
      }
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateContent = async (id: string, updatedData: Partial<SiteContent>) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update({
          ...updatedData,
          last_updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Content updated successfully');
      
      if (updatedData.section_type === 'blog' || (content.find(c => c.id === id)?.section_type === 'blog')) {
        fetchBlogPosts();
      } else {
        fetchContent();
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Content deleted successfully');
      
      if (activeTab === 'static') {
        fetchContent();
      } else {
        fetchBlogPosts();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
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
    fetchBlogPosts();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  const sectionOptions = [
    { value: 'home-hero', label: 'Home Page - Hero Section' },
    { value: 'home-overview', label: 'Home Page - Overview Section' },
    { value: 'about-mission', label: 'About Page - Mission Statement' },
    { value: 'about-history', label: 'About Page - History' },
    { value: 'amenities-description', label: 'Amenities Page - Description' },
    { value: 'contact-info', label: 'Contact Page - Information' },
    { value: 'faq-general', label: 'FAQ Page - General Information' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

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
          </TabsList>
          
          <TabsContent value="static">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Static Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="section">Section</Label>
                    <select 
                      id="section"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                    >
                      <option value="">Select Section</option>
                      {sectionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input 
                      id="title" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      placeholder="Section title" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      value={newContent} 
                      onChange={(e) => setNewContent(e.target.value)} 
                      placeholder="Content text" 
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <Button onClick={handleAddContent} disabled={saving}>
                    {saving ? 'Adding...' : 'Add Content'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Static Content</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blog">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="blog-title">Blog Post Title</Label>
                    <Input 
                      id="blog-title" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      placeholder="Post title" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="blog-section">Slug/URL</Label>
                    <Input 
                      id="blog-section" 
                      value={newSection} 
                      onChange={(e) => setNewSection(e.target.value)} 
                      placeholder="post-slug" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="blog-category">Category</Label>
                    <select 
                      id="blog-category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea 
                      id="blog-content" 
                      value={newContent} 
                      onChange={(e) => setNewContent(e.target.value)} 
                      placeholder="Blog post content" 
                      className="min-h-[300px]"
                    />
                  </div>
                  
                  <Button onClick={handleAddContent} disabled={saving}>
                    {saving ? 'Adding...' : 'Add Blog Post'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="search">Search</Label>
                      <Input 
                        id="search" 
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
                      <Label htmlFor="published-only">Published only</Label>
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
                  </div>
                  
                  {blogLoading ? (
                    <p className="text-center py-4">Loading blog posts...</p>
                  ) : blogPosts.length === 0 ? (
                    <p className="text-center py-4">No blog posts found</p>
                  ) : (
                    <div className="rounded-md border">
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
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      // Open blog post editor (to be implemented)
                                      toast.info("Blog post editor will be implemented soon");
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteContent(post.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ContentEditorProps {
  content: SiteContent;
  onUpdate: (id: string, updatedData: Partial<SiteContent>) => void;
  onDelete: (id: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(content.title || '');
  const [contentText, setContentText] = useState(content.content || '');
  const [active, setActive] = useState(content.active);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(content.id, {
        title: title || null,
        content: contentText || null,
        active
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-medium">{content.title || 'Untitled'}</h4>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(content.id)}
            >
              Delete
            </Button>
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{content.content}</p>
        <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated: {format(new Date(content.updated_at), 'MMM d, yyyy')}</span>
          </div>
          <div>
            <span className={`px-2 py-1 text-xs rounded-full ${content.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {content.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`title-${content.id}`}>Title</Label>
          <Input 
            id={`title-${content.id}`} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`content-${content.id}`}>Content</Label>
          <Textarea 
            id={`content-${content.id}`} 
            value={contentText} 
            onChange={(e) => setContentText(e.target.value)} 
            className="min-h-[150px]"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`active-${content.id}`}
            checked={active}
            onCheckedChange={setActive}
          />
          <Label htmlFor={`active-${content.id}`}>Active</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Content;
