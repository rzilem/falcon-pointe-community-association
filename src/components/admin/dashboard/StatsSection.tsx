
import React from 'react';
import StatCard from './StatCard';
import { Image, FileText, File, Mail } from 'lucide-react';

interface StatsSectionProps {
  stats: {
    imagesCount: number;
    contentCount: number;
    documentsCount: number;
  };
  loading: boolean;
  unreadMessages: number;
  loadingMessages: boolean;
  errors: any[];
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  loading,
  unreadMessages,
  loadingMessages,
  errors
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard 
        title="Images" 
        value={stats.imagesCount} 
        icon={Image} 
        isLoading={loading} 
      />
      
      <StatCard 
        title="Content" 
        value={stats.contentCount} 
        icon={FileText} 
        isLoading={loading} 
      />
      
      <StatCard 
        title="Documents" 
        value={stats.documentsCount} 
        icon={File} 
        isLoading={loading} 
      />
      
      <StatCard 
        title="Messages" 
        value={unreadMessages} 
        icon={Mail} 
        isLoading={loadingMessages}
        description="Unread messages" 
      />
      
      <StatCard 
        title="Errors" 
        value={errors.length} 
        icon={() => <div className="text-red-500">!</div>} 
      />
    </div>
  );
};

export default StatsSection;
