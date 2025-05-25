
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const NewsEventsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <CardHeader className="h-24 bg-gray-200"></CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded mt-4"></div>
          </CardContent>
          <CardFooter>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NewsEventsLoadingSkeleton;
