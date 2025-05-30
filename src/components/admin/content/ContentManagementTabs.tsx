
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaticContentPanel from './StaticContentPanel';
import BlogPostsPanel from './BlogPostsPanel';
import CategoryManager from './CategoryManager';
import TemplatesPanel from './TemplatesPanel';

const ContentManagementTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('static');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="static">Static Content</TabsTrigger>
        <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="static">
        <StaticContentPanel />
      </TabsContent>
      
      <TabsContent value="blog">
        <BlogPostsPanel />
      </TabsContent>
      
      <TabsContent value="categories">
        <CategoryManager />
      </TabsContent>
      
      <TabsContent value="templates">
        <TemplatesPanel />
      </TabsContent>
    </Tabs>
  );
};

export default ContentManagementTabs;
