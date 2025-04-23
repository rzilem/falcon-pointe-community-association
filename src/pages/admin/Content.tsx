
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
import { ChevronDown } from 'lucide-react';

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  active: boolean;
}

const Content = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchContent();
    }
  }, [isAdmin, navigate]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
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
          last_updated_by: user?.id
        });
      
      if (error) throw error;
      
      toast.success('Content added successfully');
      setNewSection('');
      setNewTitle('');
      setNewContent('');
      fetchContent();
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
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleToggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Content</CardTitle>
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
            <CardTitle>Manage Content</CardTitle>
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
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ContentEditorProps {
  content: SiteContent;
  onUpdate: (id: string, updatedData: Partial<SiteContent>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onUpdate }) => {
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{content.content}</p>
        <div className="mt-2 text-sm text-gray-500">
          Status: {content.active ? 'Active' : 'Inactive'}
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
          <input 
            type="checkbox" 
            id={`active-${content.id}`}
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4"
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
