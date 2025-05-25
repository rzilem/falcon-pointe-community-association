
import React from "react";

interface NewsEventsFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const NewsEventsFilters = ({ filter, onFilterChange }: NewsEventsFiltersProps) => {
  const categories = [
    { id: "all", name: "All Content" },
    { id: "community", name: "Community" },
    { id: "social", name: "Social" },
    { id: "meeting", name: "Meetings" },
    { id: "holiday", name: "Holiday" },
    { id: "announcements", name: "Announcements" },
    { id: "news", name: "News" },
    { id: "maintenance", name: "Maintenance" }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onFilterChange(category.id)}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === category.id 
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default NewsEventsFilters;
