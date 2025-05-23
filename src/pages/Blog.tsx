
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { SiteContent } from '@/types/content';
import { supabase } from '@/integrations/supabase/client';
import RichContentRenderer from '@/components/blog/RichContentRenderer';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  const POSTS_PER_PAGE = 9;
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    fetchBlogPosts();
  }, [activeCategory, searchQuery, currentPage]);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('category')
        .eq('section_type', 'blog')
        .eq('active', true)
        .not('category', 'is', null);
      
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(item => item.category).filter(Boolean))
      ).map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1)
      }));
      
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      // Calculate range for pagination
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      
      // Build query
      let query = supabase
        .from('site_content')
        .select('*', { count: 'exact' })
        .eq('section_type', 'blog')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      // Apply category filter
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      
      // Add search if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      // Add pagination
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setBlogPosts(data as SiteContent[]);
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / POSTS_PER_PAGE));
      }
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
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <BlogCategoryFilter 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
            />
            
            <BlogSearch 
              initialQuery={searchQuery} 
              onSearch={handleSearch}
              className="w-full md:w-64" 
            />
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
              {(activeCategory !== 'all' || searchQuery) && (
                <div className="mt-4">
                  <p className="text-gray-500 mb-4">Try changing your search criteria</p>
                  <Button onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.section}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      {post.featured_image && (
                        <div className="w-full h-48 overflow-hidden">
                          <img 
                            src={post.featured_image} 
                            alt={post.title || 'Blog post'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title || 'Untitled Post'}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.created_at)}
                          {post.category && ` • ${post.category}`}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="text-gray-600 line-clamp-3">
                          <RichContentRenderer content={post.content} truncate maxLength={150} />
                        </div>
                        <div className="mt-4 text-primary font-medium">Read more →</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <BlogPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
