
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
    <fieldset className="border-none p-0 m-0">
      <legend className="sr-only">Filter news and events by category</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            aria-pressed={filter === category.id}
            aria-label={`Filter by ${category.name}${filter === category.id ? ' (currently selected)' : ''}`}
            className={`px-3 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              filter === category.id 
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export default NewsEventsFilters;
