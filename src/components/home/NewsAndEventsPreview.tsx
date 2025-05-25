
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNewsEventsContent } from "@/hooks/useNewsEventsContent";
import NewsEventsLoadingSkeleton from "./NewsEventsLoadingSkeleton";
import NewsEventsContentCard from "./NewsEventsContentCard";
import { Calendar } from "lucide-react";

const NewsAndEventsPreview = () => {
  const { content, loading } = useNewsEventsContent();

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Latest News & Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay connected with community events, announcements, and the latest news from Falcon Pointe!
            </p>
          </div>
          <NewsEventsLoadingSkeleton />
        </div>
      </section>
    );
  }

  if (content.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Latest News & Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay connected with community events, announcements, and the latest news from Falcon Pointe!
            </p>
          </div>
          
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Content Available</h3>
              <p className="text-gray-500 mb-6">
                There are currently no news articles or events to display. Check back soon for updates!
              </p>
              <Button asChild>
                <Link to="/news-events">View News & Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Latest News & Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with community events, announcements, and the latest news from Falcon Pointe!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.map((item) => (
            <NewsEventsContentCard key={item.id} item={item} />
          ))}
        </div>
        
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
