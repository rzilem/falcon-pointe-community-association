
import React from 'react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useStaticContent } from '@/hooks/useStaticContent';
import StaticForm from './StaticForm';
import CollapsibleContentSection from './CollapsibleContentSection';
import AdminPanel from './AdminPanel';

const StaticContentPanel: React.FC = () => {
  const { openConfirmation } = useConfirmation();
  const {
    loading,
    openSections,
    contentBySection,
    handleAddContent,
    handleUpdateContent,
    handleDeleteContent,
    handleToggleSection
  } = useStaticContent();

  const handleDeleteWithConfirmation = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Content",
      description: "Are you sure you want to delete this content? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: handleDeleteContent
    });
  };

  return (
    <div className="space-y-8">
      <StaticForm onSave={handleAddContent} />
      
      <AdminPanel title="Manage Static Content">
        {loading ? (
          <p className="text-center py-4">Loading content...</p>
        ) : Object.keys(contentBySection).length === 0 ? (
          <p className="text-center py-4">No content found</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(contentBySection).map(([section, items]) => (
              <CollapsibleContentSection
                key={section}
                section={section}
                items={items}
                isOpen={openSections.includes(section)}
                onToggle={() => handleToggleSection(section)}
                onUpdate={handleUpdateContent}
                onDelete={handleDeleteWithConfirmation}
              />
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
};

export default StaticContentPanel;
