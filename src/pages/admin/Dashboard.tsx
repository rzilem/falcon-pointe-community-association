import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
      
      const [imagesResult, contentResult, documentsResult, eventsResult] = await Promise.all([
        supabase.from('site_images').select('id', { count: 'exact', head: true }),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true })
      ]);
      
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
    <AdminLayout>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Images" value={stats.imagesCount} icon={Image} loading={loading} />
          <StatCard title="Content" value={stats.contentCount} icon={FileText} loading={loading} />
          <StatCard title="Documents" value={stats.documentsCount} icon={File} loading={loading} />
          <StatCard title="Events" value={stats.eventsCount} icon={FileText} loading={loading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/images">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Manage Images
                </CardTitle>
                <CardDescription>
                  Upload and manage site images
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/content">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Manage Content
                </CardTitle>
                <CardDescription>
                  Edit website content and blog posts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/events">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Manage Events
                </CardTitle>
                <CardDescription>
                  Create and manage community events
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/documents">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Manage Documents
                </CardTitle>
                <CardDescription>
                  Upload and organize documents
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {errors.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Recent Errors ({errors.length})
              </CardTitle>
              <CardDescription>
                Errors tracked from the error tracking system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {errors.slice(0, 10).map((errorItem, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded">
                    <div className="font-mono text-xs mb-1">
                      {new Date(errorItem.timestamp).toLocaleString()}
                    </div>
                    <div className="font-semibold">{errorItem.error.message}</div>
                    {errorItem.error.stack && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-muted-foreground">
                          View stack trace
                        </summary>
                        <pre className="text-xs mt-1 overflow-x-auto">
                          {errorItem.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
