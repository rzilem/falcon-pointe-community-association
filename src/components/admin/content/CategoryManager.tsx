
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tag, Plus, Trash } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Get all categories from site_content
      const { data: contentData, error: contentError } = await supabase
        .from('site_content')
        .select('category');
      
      if (contentError) throw contentError;
      
      // Count occurrences of each category
      const categoryCounts: Record<string, number> = {};
      contentData?.forEach(item => {
        if (item.category) {
          if (categoryCounts[item.category]) {
            categoryCounts[item.category]++;
          } else {
            categoryCounts[item.category] = 1;
          }
        }
      });
      
      // Transform into category objects
      const categoryObjects: Category[] = Object.keys(categoryCounts).map(name => ({
        id: name, // Using name as ID for now
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        slug: name.toLowerCase(),
        count: categoryCounts[name]
      }));
      
      setCategories(categoryObjects);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      setSaving(true);
      
      // Generate slug if not provided
      const slug = newSlug.trim() || newCategory.trim().toLowerCase().replace(/\s+/g, '-');
      
      // We'll add a dummy content with this category just to make it available
      // This is a temporary solution until we have a proper categories table
      const { error } = await supabase
        .from('site_content')
        .insert({
          section: `category-${slug}`,
          title: `Category: ${newCategory}`,
          content: `This is a system entry for the category: ${newCategory}`,
          section_type: 'system',
          category: slug,
          active: false
        });
      
      if (error) throw error;
      
      toast.success('Category added successfully');
      setNewCategory('');
      setNewSlug('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Categories & Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Category Name</Label>
                <Input
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Announcements"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-slug">Slug (Optional)</Label>
                <Input
                  id="new-slug"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. announcements"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddCategory} 
                  disabled={saving}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.count || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
