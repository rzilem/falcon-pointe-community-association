
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageDisplay from "@/components/cms/ImageDisplay";

const AmenitiesInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ImageDisplay 
            location="amenity-center"
            alt="Community Amenity Center"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600 mb-4">
            Our Recreation Center features various amenities including:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Basketball Court</li>
            <li>Tennis Courts</li>
            <li>Swimming Pools</li>
            <li>Community Center</li>
            <li>Parks and Trails</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmenitiesInfo;
