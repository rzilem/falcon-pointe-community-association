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
import { Calendar, FileText, RefreshCw, Lock, Unlock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateSlug, isValidSlug, debounce } from '@/utils/slugUtils';

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
  const [isSlugLocked, setIsSlugLocked] = useState(false);
  const [isSlugValid, setIsSlugValid] = useState(true);
  const [useAiGeneration, setUseAiGeneration] = useState(initialContent?.use_ai_image_generation !== false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

  // Debounced slug generation function
  const debouncedGenerateSlug = useCallback(
    debounce((title: string) => {
      if (!isSlugLocked && title.trim()) {
        const newSlug = generateSlug(title);
        setSection(newSlug);
        setIsSlugValid(isValidSlug(newSlug));
      }
    }, 300),
    [isSlugLocked]
  );

  // Generate slug when title changes
  useEffect(() => {
    if (title && !initialContent) {
      debouncedGenerateSlug(title);
    }
  }, [title, debouncedGenerateSlug, initialContent]);

  // Validate slug when it changes
  useEffect(() => {
    setIsSlugValid(isValidSlug(section));
  }, [section]);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSection(e.target.value);
    // Lock the slug when manually edited
    if (!isSlugLocked) {
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

  const handleGenerateAiImage = async () => {
    if (!title || !content) {
      toast.error('Title and content are required for AI image generation');
      return;
    }

    setGeneratingImage(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('generate-blog-image', {
        body: { 
          title, 
          content: content.substring(0, 500)
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          toast.error('Failed to generate image: ' + error.message);
        }
      } else if (data?.imageUrl) {
        setFeaturedImage(data.imageUrl);
        toast.success('AI image generated successfully!');
      } else {
        toast.error('No image was generated');
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSlugValid) {
      toast.error('Please enter a valid slug (lowercase letters, numbers, and hyphens only)');
      return;
    }
    
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
        featured_image: featuredImage,
        use_ai_image_generation: useAiGeneration
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
              onChange={handleTitleChange}
              placeholder="Post title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="section">Slug/URL</Label>
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
            </div>
            <Input
              id="section"
              value={section}
              onChange={handleSectionChange}
              placeholder="post-slug"
              className={!isSlugValid ? 'border-red-500' : ''}
              required
            />
            {!isSlugValid && (
              <p className="text-sm text-red-600">
                Slug must contain only lowercase letters, numbers, and hyphens
              </p>
            )}
            {section && isSlugValid && (
              <p className="text-sm text-gray-500">
                URL: /blog/{section}
              </p>
            )}
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
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Featured Image</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-ai-generation"
                  checked={useAiGeneration}
                  onCheckedChange={setUseAiGeneration}
                />
                <Label htmlFor="use-ai-generation" className="text-sm cursor-pointer">
                  Use AI to generate image
                </Label>
              </div>
            </div>

            {useAiGeneration ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateAiImage}
                  disabled={!title || !content || generatingImage}
                  className="w-full"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating AI Image...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Image with AI
                    </>
                  )}
                </Button>
                {featuredImage && (
                  <div className="mt-2">
                    <img src={featuredImage} alt="AI Generated" className="w-full h-48 object-cover rounded" />
                    <p className="text-xs text-muted-foreground mt-1">AI-generated image</p>
                  </div>
                )}
                {!title || !content ? (
                  <p className="text-sm text-muted-foreground">
                    Add title and content to generate an AI image
                  </p>
                ) : null}
              </div>
            ) : (
              <UnifiedImageUpload
                onImageUploaded={(url) => setFeaturedImage(url || null)}
                existingImageUrl={featuredImage}
                location={section ? `blog-${section}` : 'blog-draft'}
              />
            )}
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
