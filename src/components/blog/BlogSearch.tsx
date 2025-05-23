
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  className?: string;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  initialQuery = '',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== initialQuery) {
        onSearch(searchQuery);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, initialQuery]);
  
  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full rounded-l-none"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSearch;
