
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface ContentFiltersProps {
  filterText: string;
  setFilterText: (value: string) => void;
  showPublishedOnly: boolean;
  setShowPublishedOnly: (value: boolean) => void;
  onReset: () => void;
  onSearch: () => void;
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  filterText,
  setFilterText,
  showPublishedOnly,
  setShowPublishedOnly,
  onReset,
  onSearch
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="w-full sm:w-1/2">
        <Input 
          value={filterText} 
          onChange={(e) => setFilterText(e.target.value)} 
          placeholder="Search by title, content..." 
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="published-only"
          checked={showPublishedOnly}
          onCheckedChange={setShowPublishedOnly}
        />
        <label htmlFor="published-only">Published only</label>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset
      </Button>
      <Button onClick={onSearch}>
        Search
      </Button>
    </div>
  );
};

export default ContentFilters;
