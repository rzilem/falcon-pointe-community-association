
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNewsEventsContent } from "@/hooks/useNewsEventsContent";
import NewsEventsLoadingSkeleton from "./NewsEventsLoadingSkeleton";
import NewsEventsContentCard from "./NewsEventsContentCard";

const NewsAndEventsPreview = () => {
  const { content, loading, fallbackContent } = useNewsEventsContent();
  const displayContent = content.length > 0 ? content : fallbackContent;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Latest News & Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with community events, announcements, and the latest news from Falcon Pointe!
          </p>
        </div>
        
        {loading ? (
          <NewsEventsLoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayContent.map((item) => (
              <NewsEventsContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/news-events">View All News & Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsAndEventsPreview;
