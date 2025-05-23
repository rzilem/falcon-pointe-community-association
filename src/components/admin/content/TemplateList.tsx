
import React from 'react';
import { SiteContent } from '@/types/content';
import TemplateCard from './TemplateCard';

interface TemplateListProps {
  templates: SiteContent[];
  loading: boolean;
  onUseTemplate: (template: SiteContent) => void;
  onDeleteTemplate: (template: SiteContent) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ 
  templates, 
  loading, 
  onUseTemplate, 
  onDeleteTemplate 
}) => {
  if (loading) {
    return <div className="col-span-full text-center py-8">Loading templates...</div>;
  }
  
  if (templates.length === 0) {
    return <div className="col-span-full text-center py-8">No templates found. Create your first template above.</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onUse={onUseTemplate}
          onDelete={onDeleteTemplate}
        />
      ))}
    </div>
  );
};

export default TemplateList;
