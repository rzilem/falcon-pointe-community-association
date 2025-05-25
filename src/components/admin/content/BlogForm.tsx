
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import UnifiedImageUpload from '../images/UnifiedImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import { Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface BlogFormProps {
  initialContent?: SiteContent;
  onSave: (content: Partial<SiteContent>) => Promise<void>;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialContent, onSave }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialContent?.title || '');
  const [section, setSection] = useState(initialContent?.section || '');
  const [content, setContent] = useState(initialContent?.content || '');
  const [category, setCategory] = useState(initialContent?.category || 'general');
  const [active, setActive] = useState(initialContent?.active !== false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(initialContent?.featured_image || null);
  const [saving, setSaving] = useState(false);
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [useSchedulePublish, setUseSchedulePublish] = useState(false);
  const [hasLoadedTemplate, setHasLoadedTemplate] = useState(false);

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

  useEffect(() => {
    const savedTemplate = localStorage.getItem('content_template');
    
    if (savedTemplate && !initialContent && !hasLoadedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        
        if (template.section_type === 'blog') {
          setContent(template.content || '');
          
          if (template.title) {
            setTitle(template.title);
          }
          
          if (template.category) {
            setCategory(template.category);
          }
          
          setHasLoadedTemplate(true);
          toast.success('Template loaded successfully');
          localStorage.removeItem('content_template');
        }
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
  }, [initialContent, hasLoadedTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      await onSave({
        title: title || null,
        section,
        content: content || null,
        category,
        active: useSchedulePublish ? false : active,
        section_type: 'blog',
        last_updated_by: user?.id,
        featured_image: featuredImage
      });
      
      if (!initialContent) {
        setTitle('');
        setSection('');
        setContent('');
        setCategory('general');
        setActive(true);
        setFeaturedImage(null);
        setUseSchedulePublish(false);
        setHasLoadedTemplate(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {initialContent ? 'Edit' : 'Add New'} <FileText className="ml-2 h-5 w-5" /> Blog Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Blog Post Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="section">Slug/URL</Label>
            <Input
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="post-slug"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="Blog post content"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Featured Image (Optional)</Label>
            <UnifiedImageUpload
              onImageUploaded={(url) => setFeaturedImage(url || null)}
              existingImageUrl={featuredImage}
              location={section ? `blog-${section}` : 'blog-draft'}
            />
          </div>
          
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-publish"
                checked={useSchedulePublish}
                onCheckedChange={setUseSchedulePublish}
              />
              <Label htmlFor="schedule-publish">
                Schedule Publication
              </Label>
            </div>
            
            {useSchedulePublish && (
              <div className="grid gap-2 pl-6">
                <Label htmlFor="publish-date" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Publication Date
                </Label>
                <Input
                  id="publish-date"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
              disabled={useSchedulePublish}
            />
            <Label htmlFor="active">Publish Post</Label>
          </div>
          
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;
