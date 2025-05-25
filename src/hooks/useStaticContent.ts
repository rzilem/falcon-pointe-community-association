
import { useState, useEffect } from 'react';
import { useContentManagement } from './useContentManagement';
import { SiteContent } from '@/types/content';
import { toast } from 'sonner';

export const useStaticContent = () => {
  const { content, loading, fetchContent, addContent, updateContent, deleteContent } = useContentManagement();
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
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
    try {
      await deleteContent(id);
      fetchContent({ section_type: 'static' });
    } catch (error) {
      console.error('Error deleting content:', error);
    }
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

  return {
    content,
    loading,
    openSections,
    contentBySection,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    handleToggleSection
  };
};
