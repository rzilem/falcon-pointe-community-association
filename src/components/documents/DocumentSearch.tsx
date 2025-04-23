
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocumentSearch = ({ searchQuery, setSearchQuery }: DocumentSearchProps) => {
  return (
    <div className="mb-8 flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
      <Search className="h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default DocumentSearch;
