import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl, getContentTypeLabel, formatDate } from "@/utils/newsEventsUtils";
import { ContentItem } from "@/types/newsEvents";

interface NewsEventsGridProps {
  content: ContentItem[];
  loading: boolean;
  displayContent: ContentItem[];
}

const NewsEventsGrid = ({ content, loading, displayContent }: NewsEventsGridProps) => {
  const getContentIcon = (item: ContentItem) => {
    return item.type === 'event' ? Calendar : FileText;
  };

  // Generate the correct URL based on content type
  const getDetailUrl = (item: ContentItem) => {
    if (item.type === 'event') {
      return `/events/${item.id}`;
    } else {
      // For blog posts, use the slug if available, otherwise fall back to section
      const slug = (item as any).slug || item.section;
      return `/blog/${slug}`;
    }
  };

  const getButtonText = (item: ContentItem) => {
    return item.type === 'event' ? 'Event Details' : 'Read More';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <CardHeader className="h-24 space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayContent.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Content Available</h3>
          <p className="text-gray-500">
            There are currently no news articles or events to display. Check back soon for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayContent.map((item) => {
        const imageUrl = getImageUrl(
          item.type === 'event' ? item.image_path : item.featured_image
        );
        const ContentIcon = getContentIcon(item);
        
        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden bg-gray-100">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={item.title || 'Content image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div class="h-16 w-16 text-gray-400 flex items-center justify-center">
                            ${item.type === 'event' ? '📅' : '📄'}
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ContentIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  item.type === 'event' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getContentTypeLabel(item)}
                </span>
              </div>
              {item.type === 'event' && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{formatDate(item.display_date)}</p>
                  <p>{item.time}</p>
                  <p>{item.location}</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {item.type === 'event' ? item.description : item.content?.replace(/<[^>]*>/g, '') || ''}
              </p>
              {item.category && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to={getDetailUrl(item)}>
                  {getButtonText(item)}
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NewsEventsGrid;
