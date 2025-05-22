
import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Image, FileText, File } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getErrorQueue } from '@/utils/errorTracking';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    imagesCount: 0,
    contentCount: 0,
    documentsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch image count
      const { count: imagesCount, error: imagesError } = await supabase
        .from('site_images')
        .select('id', { count: 'exact', head: true });
      
      if (imagesError) throw imagesError;
      
      // Fetch content count
      const { count: contentCount, error: contentError } = await supabase
        .from('site_content')
        .select('id', { count: 'exact', head: true });
      
      if (contentError) throw contentError;
      
      // Fetch documents count
      const { count: documentsCount, error: documentsError } = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true });
      
      // Don't throw error for documents table as it might not exist yet
      
      setStats({
        imagesCount: imagesCount || 0,
        contentCount: contentCount || 0,
        documentsCount: documentsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Get any tracked errors
  const errors = getErrorQueue();

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">
                  {loading ? '...' : stats.imagesCount}
                </div>
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">
                  {loading ? '...' : stats.contentCount}
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">
                  {loading ? '...' : stats.documentsCount}
                </div>
                <File className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">
                  {errors.length}
                </div>
                <div className="text-red-500">!</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/images">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Image Management</CardTitle>
                <CardDescription>Manage site images and media content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Upload, replace, and organize images across the website.
                  Add, edit, or delete images used on various pages.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/content">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Update site content and information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Edit text content, announcements, and site information.
                  Manage descriptions, rules, and other important text.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/documents">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Manage association documents and forms</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Upload and organize important documents like bylaws, 
                  forms, meeting minutes, and community guidelines.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Recent Activity - to be implemented in future enhancements */}
        {/* <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-gray-500 py-4">
                Activity tracking will be added in future updates
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
