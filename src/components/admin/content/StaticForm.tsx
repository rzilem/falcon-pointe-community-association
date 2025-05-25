
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

interface StaticFormProps {
  initialContent?: SiteContent;
  onSave: (content: Partial<SiteContent>) => Promise<void>;
}

const StaticForm: React.FC<StaticFormProps> = ({ initialContent, onSave }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialContent?.title || '');
  const [section, setSection] = useState(initialContent?.section || '');
  const [content, setContent] = useState(initialContent?.content || '');
  const [active, setActive] = useState(initialContent?.active !== false);
  const [saving, setSaving] = useState(false);
  const [hasLoadedTemplate, setHasLoadedTemplate] = useState(false);

  const sectionOptions = [
    { value: 'home-hero', label: 'Home Page - Hero Section' },
    { value: 'home-overview', label: 'Home Page - Overview Section' },
    { value: 'about-mission', label: 'About Page - Mission Statement' },
    { value: 'about-history', label: 'About Page - History' },
    { value: 'amenities-description', label: 'Amenities Page - Description' },
    { value: 'contact-info', label: 'Contact Page - Information' },
    { value: 'faq-general', label: 'FAQ Page - General Information' }
  ];

  useEffect(() => {
    const savedTemplate = localStorage.getItem('content_template');
    
    if (savedTemplate && !initialContent && !hasLoadedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        
        if (template.section_type === 'static') {
          setContent(template.content || '');
          
          if (template.title) {
            setTitle(template.title);
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
        category: null,
        active,
        section_type: 'static',
        last_updated_by: user?.id,
        featured_image: null
      });
      
      if (!initialContent) {
        setTitle('');
        setSection('');
        setContent('');
        setActive(true);
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
          {initialContent ? 'Edit' : 'Add New'} <FileText className="ml-2 h-5 w-5" /> Static Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="section">Section</Label>
            {sectionOptions.length > 0 ? (
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
                placeholder="custom-section-name"
                required
              />
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="Content text"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StaticForm;
