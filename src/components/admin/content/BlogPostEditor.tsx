import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import UnifiedImageUpload from '../images/UnifiedImageUpload';
import RichTextEditor from './RichTextEditor';
import { RefreshCw, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { generateSlug, isValidSlug, debounce } from '@/utils/slugUtils';

interface BlogPostEditorProps {
  post: SiteContent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SiteContent>) => Promise<void>;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ post, isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(post.title || '');
  const [section, setSection] = useState(post.section || '');
  const [content, setContent] = useState(post.content || '');
  const [category, setCategory] = useState(post.category || 'general');
  const [active, setActive] = useState(post.active !== false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(post.featured_image || null);
  const [saving, setSaving] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(true); // Default locked for existing posts
  const [isSlugValid, setIsSlugValid] = useState(true);

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

  // Generate slug when title changes (only if unlocked)
  useEffect(() => {
    if (title && !isSlugLocked) {
      debouncedGenerateSlug(title);
    }
  }, [title, debouncedGenerateSlug, isSlugLocked]);

  // Validate slug when it changes
  useEffect(() => {
    setIsSlugValid(isValidSlug(section));
  }, [section]);

  // Reset form when post changes
  useEffect(() => {
    setTitle(post.title || '');
    setSection(post.section || '');
    setContent(post.content || '');
    setCategory(post.category || 'general');
    setActive(post.active !== false);
    setFeaturedImage(post.featured_image || null);
    setIsSlugLocked(true); // Reset to locked for existing posts
  }, [post]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Blog post title is required');
      return;
    }

    if (!section.trim()) {
      toast.error('Blog post slug is required');
      return;
    }

    if (!isSlugValid) {
      toast.error('Please enter a valid slug (lowercase letters, numbers, and hyphens only)');
      return;
    }

    try {
      setSaving(true);
      
      await onSave(post.id, {
        title,
        section,
        content,
        category,
        active,
        last_updated_by: user?.id,
        featured_image: featuredImage
      });
      
      toast.success('Blog post updated successfully');
      onClose();
    } catch (error) {
      toast.error('Error updating blog post');
      console.error('Error updating blog post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setTitle(post.title || '');
    setSection(post.section || '');
    setContent(post.content || '');
    setCategory(post.category || 'general');
    setActive(post.active !== false);
    setFeaturedImage(post.featured_image || null);
    setIsSlugLocked(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Blog Post Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Post title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-section">Slug/URL</Label>
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
              id="edit-section"
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
            <Label htmlFor="edit-category">Category</Label>
            <select
              id="edit-category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Content</Label>
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
              location={`blog-${post.section}`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="edit-active">Publish Post</Label>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;
