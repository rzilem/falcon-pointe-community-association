
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import ContentManagementTabs from '@/components/admin/content/ContentManagementTabs';

const Content = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    }
  }, [isAdmin, navigate]);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        
        <ContentManagementTabs />
      </div>
    </AdminLayout>
  );
};

export default Content;
