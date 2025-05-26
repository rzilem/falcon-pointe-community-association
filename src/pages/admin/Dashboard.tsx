
import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Image, FileText, File, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getErrorQueue } from '@/utils/errorTracking';

interface DashboardStats {
  imagesCount: number;
  contentCount: number;
  documentsCount: number;
  eventsCount: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    imagesCount: 0,
    contentCount: 0,
    documentsCount: 0,
    eventsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all statistics in parallel for better performance
      const [imagesResult, contentResult, documentsResult, eventsResult] = await Promise.all([
        supabase.from('site_images').select('id', { count: 'exact', head: true }),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true })
      ]);
      
      // Check for any errors but don't throw for missing tables
      if (imagesResult.error) console.warn('Images fetch error:', imagesResult.error);
      if (contentResult.error) console.warn('Content fetch error:', contentResult.error);
      if (documentsResult.error) console.warn('Documents fetch error:', documentsResult.error);
      if (eventsResult.error) console.warn('Events fetch error:', eventsResult.error);
      
      setStats({
        imagesCount: imagesResult.count || 0,
        contentCount: contentResult.count || 0,
        documentsCount: documentsResult.count || 0,
        eventsCount: eventsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const errors = getErrorQueue();

  const StatCard = ({ title, value, icon: Icon, loading: cardLoading }: {
    title: string;
    value: number;
    icon: React.ElementType;
    loading: boolean;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          {cardLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <div className="text-3xl font-bold">{value}</div>
          )}
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Images" value={stats.imagesCount} icon={Image} loading={loading} />
          <StatCard title="Content" value={stats.contentCount} icon={FileText} loading={loading} />
          <StatCard title="Documents" value={stats.documentsCount} icon={File} loading={loading} />
          <StatCard title="Errors" value={errors.length} icon={AlertTriangle} loading={false} />
        </div>
        
        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/images" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  Image Management
                </CardTitle>
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
          
          <Link to="/admin/content" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Content Management
                </CardTitle>
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
          
          <Link to="/admin/events" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Event Management
                </CardTitle>
                <CardDescription>Manage community events and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Create, edit, and organize community events.
                  Manage event details, images, and scheduling.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/documents" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <File className="mr-2 h-5 w-5" />
                  Document Management
                </CardTitle>
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
      </div>
    </div>
  );
};

export default Dashboard;
