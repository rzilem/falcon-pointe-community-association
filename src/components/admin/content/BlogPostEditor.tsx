
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '../events/ImageUpload';
import RichTextEditor from './RichTextEditor';
import { toast } from 'sonner';

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
  const [imagePath, setImagePath] = useState<string | null>(post.featured_image || null);
  const [saving, setSaving] = useState(false);

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

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

    try {
      setSaving(true);
      
      await onSave(post.id, {
        title,
        section,
        content,
        category,
        active,
        last_updated_by: user?.id,
        featured_image: imagePath
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
    setImagePath(post.featured_image || null);
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-section">Slug/URL</Label>
            <Input
              id="edit-section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="post-slug"
              required
            />
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
            <ImageUpload
              onImageUploaded={(url) => setImagePath(url)}
              existingImageUrl={imagePath}
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
