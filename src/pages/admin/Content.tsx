
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useConfirmation } from '@/hooks/useConfirmation';
import ContentManagementTabs from '@/components/admin/content/ContentManagementTabs';

const Content = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    isConfirmationOpen,
    closeConfirmation,
    handleConfirmAction,
    confirmationTitle,
    confirmationDescription,
    confirmationVariant,
    confirmationButtonLabel,
    cancelButtonLabel
  } = useConfirmation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    }
  }, [isAdmin, navigate]);

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        
        <ContentManagementTabs />
      </div>

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

export default Content;
