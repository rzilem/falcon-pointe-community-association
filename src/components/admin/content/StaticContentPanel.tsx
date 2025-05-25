
import React, { useState } from 'react';
import { useContentManagement } from '@/hooks/useContentManagement';
import StaticForm from './StaticForm';
import ContentEditor from './ContentEditor';
import { SiteContent } from '@/types/content';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

const StaticContentPanel: React.FC = () => {
  const { content, loading, fetchContent, addContent, updateContent, deleteContent } = useContentManagement();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const { openConfirmation } = useConfirmation();

  React.useEffect(() => {
    fetchContent({ section_type: 'static' });
  }, []);

  const handleAddContent = async (newContent: Partial<SiteContent>) => {
    try {
      await addContent(newContent as Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>);
      fetchContent({ section_type: 'static' });
      toast.success('Content added successfully');
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleUpdateContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      await updateContent(id, updates);
      fetchContent({ section_type: 'static' });
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Content",
      description: "Are you sure you want to delete this content? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (contentId) => {
        try {
          await deleteContent(contentId);
          fetchContent({ section_type: 'static' });
        } catch (error) {
          console.error('Error deleting content:', error);
        }
      }
    });
  };

  const handleToggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };

  // Group content by section
  const contentBySection = content.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  return (
    <div className="space-y-8">
      <StaticForm onSave={handleAddContent} />
      
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Static Content</h2>
        
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
                      onDelete={handleDeleteContent}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticContentPanel;
