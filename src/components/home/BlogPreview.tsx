
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SiteContent } from '@/types/content';
import { format } from 'date-fns';
import RichContentRenderer from '@/components/blog/RichContentRenderer';

const BlogPreview = () => {
  const [posts, setPosts] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      setPosts(data as SiteContent[]);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (posts.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Community News & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest happenings, announcements, and stories from our community
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col">
                  {post.featured_image && (
                    <div className="w-full h-40 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title || 'Blog post'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title || 'Untitled Post'}</CardTitle>
                    <CardDescription>
                      {formatDate(post.created_at)}
                      {post.category && ` • ${post.category}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-gray-600 line-clamp-3">
                      <RichContentRenderer content={post.content} truncate maxLength={120} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/blog/${post.section}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild>
                <Link to="/blog">View All Posts</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
