
import React from 'react';
import { SiteContent } from '@/types/content';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TemplateForm from './TemplateForm';
import TemplateList from './TemplateList';

interface TemplatesTabProps {
  category: string;
  templates: SiteContent[];
  loading: boolean;
  onRefresh: () => void;
  onUseTemplate: (template: SiteContent) => void;
  onDeleteTemplate: (template: SiteContent) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({
  category,
  templates,
  loading,
  onRefresh,
  onUseTemplate,
  onDeleteTemplate
}) => {
  const title = category === 'static' ? 'Static Content Template' : 'Blog Post Template';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm category={category} onSuccess={onRefresh} />
        </CardContent>
      </Card>
      
      <TemplateList
        templates={templates}
        loading={loading}
        onUseTemplate={onUseTemplate}
        onDeleteTemplate={onDeleteTemplate}
      />
    </div>
  );
};

export default TemplatesTab;
