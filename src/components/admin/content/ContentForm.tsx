import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import UnifiedImageUpload from '../images/UnifiedImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import { Calendar, FileText, RefreshCw, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { generateSlug, isValidSlug, debounce } from '@/utils/slugUtils';

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
  const [featuredImage, setFeaturedImage] = useState<string | null>(initialContent?.featured_image || null);
  const [saving, setSaving] = useState(false);
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [useSchedulePublish, setUseSchedulePublish] = useState(false);
  const [hasLoadedTemplate, setHasLoadedTemplate] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(false);
  const [isSlugValid, setIsSlugValid] = useState(true);

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

  // Debounced slug generation function (only for blog content)
  const debouncedGenerateSlug = useCallback(
    debounce((title: string) => {
      if (contentType === 'blog' && !isSlugLocked && title.trim()) {
        const newSlug = generateSlug(title);
        setSection(newSlug);
        setIsSlugValid(isValidSlug(newSlug));
      }
    }, 300),
    [isSlugLocked, contentType]
  );

  // Generate slug when title changes (blog content only)
  useEffect(() => {
    if (contentType === 'blog' && title && !initialContent) {
      debouncedGenerateSlug(title);
    }
  }, [title, debouncedGenerateSlug, initialContent, contentType]);

  // Validate slug when it changes (blog content only)
  useEffect(() => {
    if (contentType === 'blog') {
      setIsSlugValid(isValidSlug(section));
    }
  }, [section, contentType]);

  // Check for templates on initial load or when tab changes
  useEffect(() => {
    const savedTemplate = localStorage.getItem('content_template');
    
    if (savedTemplate && !initialContent && !hasLoadedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        
        // Only load if the template is for the current content type
        if ((template.section_type === 'static' && contentType === 'static') || 
            (template.section_type === 'blog' && contentType === 'blog')) {
          
          setContent(template.content || '');
          
          if (template.title && contentType === 'blog') {
            setTitle(template.title);
          }
          
          if (template.category && contentType === 'blog') {
            setCategory(template.category);
          }
          
          setHasLoadedTemplate(true);
          toast.success('Template loaded successfully');
          
          // Clear the template from localStorage to prevent reloading
          localStorage.removeItem('content_template');
        }
      } catch (error) {
        console.error('Error loading template:', error);
      }
    }
  }, [contentType, initialContent, hasLoadedTemplate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSection(e.target.value);
    // Lock the slug when manually edited (blog content only)
    if (contentType === 'blog' && !isSlugLocked) {
      setIsSlugLocked(true);
    }
  };

  const handleRegenerateSlug = () => {
    if (title.trim()) {
      const newSlug = generateSlug(title);
      setSection(newSlug);
      setIsSlugValid(isValidSlug(newSlug));
      setIsSlugLocked(false);
      toast.success('Slug regenerated from title');
    }
  };

  const toggleSlugLock = () => {
    setIsSlugLocked(!isSlugLocked);
    toast.info(isSlugLocked ? 'Slug unlocked for auto-generation' : 'Slug locked from auto-generation');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contentType === 'blog' && !isSlugValid) {
      toast.error('Please enter a valid slug (lowercase letters, numbers, and hyphens only)');
      return;
    }
    
    try {
      setSaving(true);
      
      await onSave({
        title: title || null,
        section,
        content: content || null,
        category: contentType === 'blog' ? category : null,
        active: useSchedulePublish ? false : active,
        section_type: contentType,
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
        setIsSlugLocked(false);
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
        <CardTitle className="flex items-center">
          {initialContent ? 'Edit' : 'Add New'} {contentType === 'static' ? 
            <><FileText className="ml-2 h-5 w-5" /> Static Content</> : 
            <><FileText className="ml-2 h-5 w-5" /> Blog Post</>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {contentType === 'blog' && (
            <div className="grid gap-2">
              <Label htmlFor="title">Blog Post Title</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Post title"
                required
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="section">
                {contentType === 'static' ? 'Section' : 'Slug/URL'}
              </Label>
              {contentType === 'blog' && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleSlugLock}
                    title={isSlugLocked ? 'Unlock auto-generation' : 'Lock from auto-generation'}
                  >
                    {isSlugLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateSlug}
                    disabled={!title.trim()}
                    title="Regenerate slug from title"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
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
                onChange={handleSectionChange}
                placeholder={contentType === 'static' ? 'custom-section-name' : 'post-slug'}
                className={contentType === 'blog' && !isSlugValid ? 'border-red-500' : ''}
                required
              />
            )}
            {contentType === 'blog' && !isSlugValid && (
              <p className="text-sm text-red-600">
                Slug must contain only lowercase letters, numbers, and hyphens
              </p>
            )}
            {contentType === 'blog' && section && isSlugValid && (
              <p className="text-sm text-gray-500">
                URL: /blog/{section}
              </p>
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
                <Label htmlFor="featured-image">Featured Image (Optional)</Label>
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
