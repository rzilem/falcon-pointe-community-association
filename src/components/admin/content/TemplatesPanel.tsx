
import React, { useState, useEffect } from 'react';
import { useContentManagement } from '@/hooks/useContentManagement';
import { SiteContent } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import { Copy, Save, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const TemplatesPanel: React.FC = () => {
  const { content, loading, fetchContent, addContent, updateContent, deleteContent } = useContentManagement();
  const { openConfirmation } = useConfirmation();
  const [templates, setTemplates] = useState<SiteContent[]>([]);
  const [activeTab, setActiveTab] = useState('static');
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent({ section_type: 'template' });
  }, []);

  useEffect(() => {
    // Filter content to get only templates
    const templateContent = content.filter(item => item.section_type === 'template');
    setTemplates(templateContent);
  }, [content]);

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
        category: activeTab, // Use the active tab as the template category (static, blog, etc.)
        active: true
      });
      
      toast.success('Template created successfully');
      fetchContent({ section_type: 'template' });
      
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

  const handleDeleteTemplate = (template: SiteContent) => {
    openConfirmation({
      itemId: template.id,
      title: "Delete Template",
      description: "Are you sure you want to delete this template? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (templateId) => {
        try {
          await deleteContent(templateId);
          fetchContent({ section_type: 'template' });
          toast.success('Template deleted successfully');
        } catch (error) {
          toast.error('Error deleting template');
          console.error('Error deleting template:', error);
        }
      }
    });
  };

  const handleUseTemplate = (template: SiteContent) => {
    // We'll use localStorage to store the template for use in the content form
    // This allows us to use the template across different tabs
    localStorage.setItem('content_template', JSON.stringify({
      content: template.content,
      title: template.title,
      category: template.category,
      section_type: activeTab === 'blog' ? 'blog' : 'static'
    }));
    
    toast.success(`Template "${template.title}" loaded. Switch to the ${activeTab === 'blog' ? 'Blog Posts' : 'Static Content'} tab to use it.`);
  };

  const filteredTemplates = templates.filter(
    template => template.category === activeTab || template.category === 'all'
  );

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="static">Static Content Templates</TabsTrigger>
          <TabsTrigger value="blog">Blog Post Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="static" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Static Content Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="template-title">Template Name</Label>
                  <Input
                    id="template-title"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                    placeholder="Homepage Hero"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="template-description">Description (Optional)</Label>
                  <Textarea
                    id="template-description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Template for homepage hero sections"
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
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading templates...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="col-span-full text-center py-8">No templates found. Create your first template above.</div>
            ) : (
              filteredTemplates.map(template => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    {template.description && <p className="text-sm text-gray-600">{template.description}</p>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="max-h-40 overflow-hidden text-sm text-gray-500">
                      {template.content && (
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: template.content }} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Blog Post Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="blog-template-title">Template Name</Label>
                  <Input
                    id="blog-template-title"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                    placeholder="News Article"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blog-template-description">Description (Optional)</Label>
                  <Textarea
                    id="blog-template-description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Template for news articles"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blog-template-content">Template Content</Label>
                  <RichTextEditor
                    value={newTemplate.content}
                    onChange={(content) => setNewTemplate({...newTemplate, content})}
                    placeholder="Blog post template content..."
                  />
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Template'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading templates...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="col-span-full text-center py-8">No templates found. Create your first template above.</div>
            ) : (
              filteredTemplates.map(template => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    {template.description && <p className="text-sm text-gray-600">{template.description}</p>}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="max-h-40 overflow-hidden text-sm text-gray-500">
                      {template.content && (
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: template.content }} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPanel;
