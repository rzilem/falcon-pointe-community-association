
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '../events/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import { Calendar } from 'lucide-react';

interface ContentFormProps {
  initialContent?: SiteContent;
  onSave: (content: Partial<SiteContent>) => Promise<void>;
  contentType: 'static' | 'blog';
}

const ContentForm: React.FC<ContentFormProps> = ({ initialContent, onSave, contentType }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialContent?.title || '');
  const [section, setSection] = useState(initialContent?.section || '');
  const [content, setContent] = useState(initialContent?.content || '');
  const [category, setCategory] = useState(initialContent?.category || 'general');
  const [active, setActive] = useState(initialContent?.active !== false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [useSchedulePublish, setUseSchedulePublish] = useState(false);

  const sectionOptions = contentType === 'static' ? [
    { value: 'home-hero', label: 'Home Page - Hero Section' },
    { value: 'home-overview', label: 'Home Page - Overview Section' },
    { value: 'about-mission', label: 'About Page - Mission Statement' },
    { value: 'about-history', label: 'About Page - History' },
    { value: 'amenities-description', label: 'Amenities Page - Description' },
    { value: 'contact-info', label: 'Contact Page - Information' },
    { value: 'faq-general', label: 'FAQ Page - General Information' }
  ] : [];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      await onSave({
        title: title || null,
        section,
        content: content || null,
        category: contentType === 'blog' ? category : null,
        active: useSchedulePublish ? false : active, // If scheduled, set to draft
        section_type: contentType,
        last_updated_by: user?.id
        // We could add scheduled_publish_at for future enhancement
      });
      
      if (!initialContent) {
        // Reset form if this was a new content creation
        setTitle('');
        setSection('');
        setContent('');
        setCategory('general');
        setActive(true);
        setImagePath(null);
        setUseSchedulePublish(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialContent ? 'Edit' : 'Add New'} {contentType === 'static' ? 'Static Content' : 'Blog Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {contentType === 'blog' && (
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
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="section">
              {contentType === 'static' ? 'Section' : 'Slug/URL'}
            </Label>
            {contentType === 'static' && sectionOptions.length > 0 ? (
              <select
                id="section"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
              >
                <option value="">Select Section</option>
                {sectionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder={contentType === 'static' ? 'custom-section-name' : 'post-slug'}
                required
              />
            )}
          </div>
          
          {contentType === 'static' && (
            <div className="grid gap-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Section title"
              />
            </div>
          )}
          
          {contentType === 'blog' && (
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
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={handleContentChange}
              placeholder={contentType === 'static' ? 'Content text' : 'Blog post content'}
            />
          </div>
          
          {contentType === 'blog' && (
            <>
              <div className="grid gap-2">
                <Label>Featured Image (Optional)</Label>
                <ImageUpload
                  onImageUploaded={(url) => setImagePath(url)}
                  existingImageUrl={imagePath}
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
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
              disabled={useSchedulePublish}
            />
            <Label htmlFor="active">
              {contentType === 'blog' ? 'Publish Post' : 'Active'}
            </Label>
          </div>
          
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
