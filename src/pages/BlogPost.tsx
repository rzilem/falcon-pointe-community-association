
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { SiteContent } from '@/types/content';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import RichContentRenderer from '@/components/blog/RichContentRenderer';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);
  
  const fetchBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to find by slug
      let { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_type', 'blog')
        .eq('active', true)
        .eq('slug', slug)
        .maybeSingle();
      
      // If not found by slug, try by section (for backward compatibility)
      if (!data && !error) {
        ({ data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section_type', 'blog')
          .eq('active', true)
          .eq('section', slug)
          .maybeSingle());
      }
      
      if (error) throw error;
      
      if (!data) {
        setError('Blog post not found');
        return;
      }
      
      setPost(data as SiteContent);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The post you're looking for could not be found or might have been removed.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title || 'Blog post'} 
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-8">
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.category && (
              <>
                <span className="mx-2">•</span>
                <span className="capitalize">{post.category}</span>
              </>
            )}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <RichContentRenderer content={post.content} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
