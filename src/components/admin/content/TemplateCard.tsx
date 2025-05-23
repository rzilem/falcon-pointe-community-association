
import React from 'react';
import { SiteContent } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Copy, Trash } from 'lucide-react';

interface TemplateCardProps {
  template: SiteContent;
  onUse: (template: SiteContent) => void;
  onDelete: (template: SiteContent) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, onDelete }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        {template.description && <p className="text-sm text-gray-600">{template.description}</p>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="max-h-40 overflow-hidden text-sm text-gray-500">
          {template.content && (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: template.content }} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onUse(template)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Use Template
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(template)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
