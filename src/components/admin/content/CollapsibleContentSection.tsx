
import React from 'react';
import { SiteContent } from '@/types/content';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import ContentEditor from './ContentEditor';

interface CollapsibleContentSectionProps {
  section: string;
  items: SiteContent[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Partial<SiteContent>) => void;
  onDelete: (id: string) => void;
}

const CollapsibleContentSection: React.FC<CollapsibleContentSectionProps> = ({
  section,
  items,
  isOpen,
  onToggle,
  onUpdate,
  onDelete
}) => {
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={onToggle}
      className="border rounded-md"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex w-full justify-between p-4"
        >
          <span>{section}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 space-y-4">
        {items.map((item) => (
          <ContentEditor 
            key={item.id}
            content={item}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleContentSection;
