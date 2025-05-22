
import React from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import StatsSection from '@/components/admin/dashboard/StatsSection';
import ManagementSection from '@/components/admin/dashboard/ManagementSection';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUnreadMessagesCount } from '@/hooks/useMessages';
import Layout from '@/components/layout/Layout';

const Dashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { stats, loading: statsLoading, errors, refreshStats } = useDashboardStats();
  const { count: unreadMessages, isLoading: loadingMessages } = useUnreadMessagesCount();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Show regular user dashboard if not admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Member Dashboard</h1>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
            <p className="mb-4">
              Thank you for logging in. This area is reserved for community administrators.
            </p>
            <p>
              If you need administrative access, please contact the HOA management.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Admin dashboard
  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <StatsSection
          stats={stats}
          loading={statsLoading}
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
