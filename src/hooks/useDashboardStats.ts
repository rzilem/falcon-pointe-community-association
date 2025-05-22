
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getErrorQueue } from '@/utils/errorTracking';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    imagesCount: 0,
    contentCount: 0,
    documentsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    // Get tracked errors
    setErrors(getErrorQueue());
  }, []);

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

  return {
    stats,
    loading,
    errors,
    refreshStats: fetchStats
  };
};
