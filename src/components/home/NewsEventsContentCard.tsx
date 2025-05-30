
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentItem } from "@/types/newsEvents";
import { formatDate, getImageUrl, getContentTypeLabel } from "@/utils/newsEventsUtils";

interface NewsEventsContentCardProps {
  item: ContentItem;
}

const NewsEventsContentCard = ({ item }: NewsEventsContentCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = getImageUrl(
    item.type === 'event' ? item.image_path : item.featured_image
  );
  
  const ContentIcon = item.type === 'event' ? Calendar : FileText;
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setImageError(false);
  };

  // Generate the correct URL based on content type
  const getDetailUrl = () => {
    if (item.type === 'event') {
      return `/events/${item.id}`;
    } else {
      // For blog posts, use the slug if available, otherwise fall back to section
      const slug = (item as any).slug || item.section;
      return `/blog/${slug}`;
    }
  };

  const getButtonText = () => {
    return item.type === 'event' ? 'Event Details' : 'Read More';
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden bg-gray-100">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={item.title || 'Content image'}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ContentIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
            item.type === 'event' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {getContentTypeLabel(item)}
          </span>
        </div>
        {item.type === 'event' && (
          <CardDescription className="font-medium text-primary">
            {formatDate(item.display_date)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {item.type === 'event' && (
            <>
              <p className="text-sm"><strong>Time:</strong> {item.time}</p>
              <p className="text-sm"><strong>Location:</strong> {item.location}</p>
            </>
          )}
          <p className="mt-4 text-gray-600 line-clamp-3">
            {item.type === 'event' 
              ? item.description 
              : item.content?.replace(/<[^>]*>/g, '') || ''
            }
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link to={getDetailUrl()}>
            {getButtonText()}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsEventsContentCard;
