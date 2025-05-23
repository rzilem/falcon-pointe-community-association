
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { SiteContent } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'general', name: 'General' },
    { id: 'news', name: 'News' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'community', name: 'Community' }
  ];
  
  useEffect(() => {
    fetchBlogPosts();
  }, [activeCategory]);
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Ensure section_type is set for all items
      const typedData: SiteContent[] = (data || []).map(item => ({
        ...item,
        section_type: item.section_type || 'blog'
      }));
      
      setBlogPosts(typedData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Community Blog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Stay up to date with the latest news, announcements, and stories from our community
          </p>
        </div>
      </div>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl font-medium text-gray-600">No blog posts found</p>
              {activeCategory !== 'all' && (
                <p className="mt-2 text-gray-500">Try selecting a different category</p>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.section}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{post.title || 'Untitled Post'}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(post.created_at)}
                        {post.category && ` • ${post.category}`}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">{post.content}</p>
                      <div className="mt-4 text-primary font-medium">Read more →</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
