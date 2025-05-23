
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import { useContentManagement } from '@/hooks/useContentManagement';
import { useAuth } from '@/context/AuthContext';
import { SiteContent } from '@/types/content';

interface TemplateFormProps {
  category: string;
  onSuccess: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ category, onSuccess }) => {
  const { addContent } = useContentManagement();
  const { user } = useAuth();
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTemplate.title.trim()) {
      toast.error('Template name is required');
      return;
    }

    setSaving(true);

    try {
      await addContent({
        title: newTemplate.title,
        content: newTemplate.content,
        section: newTemplate.title.toLowerCase().replace(/\s+/g, '-'),
        section_type: 'template',
        category: category, // Use the category prop
        active: true,
        last_updated_by: user?.id || null,
        description: newTemplate.description || null,
        featured_image: null
      });
      
      toast.success('Template created successfully');
      onSuccess();
      
      // Reset form
      setNewTemplate({
        title: '',
        content: '',
        description: ''
      });
    } catch (error) {
      toast.error('Error creating template');
      console.error('Error creating template:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleCreateTemplate} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="template-title">Template Name</Label>
        <Input
          id="template-title"
          value={newTemplate.title}
          onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
          placeholder={category === 'static' ? "Homepage Hero" : "News Article"}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="template-description">Description (Optional)</Label>
        <Textarea
          id="template-description"
          value={newTemplate.description}
          onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
          placeholder={category === 'static' ? "Template for homepage hero sections" : "Template for news articles"}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="template-content">Template Content</Label>
        <RichTextEditor
          value={newTemplate.content}
          onChange={(content) => setNewTemplate({...newTemplate, content})}
          placeholder="Content template..."
        />
      </div>
      
      <Button type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create Template'}
      </Button>
    </form>
  );
};

export default TemplateForm;
