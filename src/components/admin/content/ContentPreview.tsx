
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteContent } from '@/types/content';
import { Eye, Smartphone, Monitor } from 'lucide-react';

interface ContentPreviewProps {
  content: SiteContent;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Content Preview: {content.title || 'Untitled'}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="desktop" className="w-full">
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="desktop" className="flex items-center">
                <Monitor className="mr-2 h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center">
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="desktop" className="mt-0">
            <div className="border rounded-md p-6">
              <h2 className="text-3xl font-bold mb-4">{content.title || 'Untitled'}</h2>
              <div className="prose max-w-none">
                {content.content?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-0 flex justify-center">
            <div className="border rounded-md p-4 w-[375px] h-[667px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-3">{content.title || 'Untitled'}</h2>
              <div className="prose prose-sm">
                {content.content?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreview;
