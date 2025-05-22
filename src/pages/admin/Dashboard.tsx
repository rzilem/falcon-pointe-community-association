
import React from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import StatsSection from '@/components/admin/dashboard/StatsSection';
import ManagementSection from '@/components/admin/dashboard/ManagementSection';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUnreadMessagesCount } from '@/hooks/useMessages';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { stats, loading, errors, refreshStats } = useDashboardStats();
  const { count: unreadMessages, isLoading: loadingMessages } = useUnreadMessagesCount();

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <StatsSection
          stats={stats}
          loading={loading}
          unreadMessages={unreadMessages}
          loadingMessages={loadingMessages}
          errors={errors}
        />
        
        {/* Management Cards */}
        <ManagementSection />
      </div>
    </div>
  );
};

export default Dashboard;
