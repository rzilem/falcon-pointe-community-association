
import React from 'react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useStaticContent } from '@/hooks/useStaticContent';
import StaticForm from './StaticForm';
import CollapsibleContentSection from './CollapsibleContentSection';
import AdminPanel from './AdminPanel';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const StaticContentPanel: React.FC = () => {
  const {
    isConfirmationOpen,
    closeConfirmation,
    handleConfirmAction,
    confirmationTitle,
    confirmationDescription,
    confirmationVariant,
    confirmationButtonLabel,
    cancelButtonLabel,
    openConfirmation
  } = useConfirmation();
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

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationTitle}
        description={confirmationDescription}
        confirmLabel={confirmationButtonLabel}
        cancelLabel={cancelButtonLabel}
        variant={confirmationVariant}
      />
    </div>
  );
};

export default StaticContentPanel;
