
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <Skeleton className="h-8 w-48 bg-gray-600" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
