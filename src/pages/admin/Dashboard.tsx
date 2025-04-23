
import React from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>Manage site images and media content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Upload, replace, and organize images across the website.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Update site content and information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Edit text content, announcements, and site information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
