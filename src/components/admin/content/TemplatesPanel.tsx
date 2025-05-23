
import React, { useState, useEffect } from 'react';
import { useContentManagement } from '@/hooks/useContentManagement';
import { SiteContent } from '@/types/content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import TemplatesTab from './TemplatesTab';

const TemplatesPanel: React.FC = () => {
  const { content, loading, fetchContent, deleteContent } = useContentManagement();
  const { openConfirmation } = useConfirmation();
  const [templates, setTemplates] = useState<SiteContent[]>([]);
  const [activeTab, setActiveTab] = useState('static');

  useEffect(() => {
    fetchContent({ section_type: 'template' });
  }, []);

  useEffect(() => {
    // Filter content to get only templates
    const templateContent = content.filter(item => item.section_type === 'template');
    setTemplates(templateContent);
  }, [content]);

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
    localStorage.setItem('content_template', JSON.stringify({
      content: template.content,
      title: template.title,
      category: template.category,
      section_type: activeTab === 'blog' ? 'blog' : 'static'
    }));
    
    toast.success(`Template "${template.title}" loaded. Switch to the ${activeTab === 'blog' ? 'Blog Posts' : 'Static Content'} tab to use it.`);
  };

  const refreshTemplates = () => {
    fetchContent({ section_type: 'template' });
  };

  // Filter templates based on active tab
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
        
        <TabsContent value="static">
          <TemplatesTab
            category="static"
            templates={filteredTemplates}
            loading={loading}
            onRefresh={refreshTemplates}
            onUseTemplate={handleUseTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </TabsContent>
        
        <TabsContent value="blog">
          <TemplatesTab
            category="blog"
            templates={filteredTemplates}
            loading={loading}
            onRefresh={refreshTemplates}
            onUseTemplate={handleUseTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPanel;
