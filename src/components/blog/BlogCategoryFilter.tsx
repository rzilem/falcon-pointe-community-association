
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface BlogCategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = ''
}) => {
  if (categories.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center text-sm text-gray-500 mr-2">
        <Tag className="h-4 w-4 mr-1" />
        <span>Filter by:</span>
      </div>
      
      <Button
        key="all"
        size="sm"
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('all')}
      >
        All
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={activeCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default BlogCategoryFilter;
