
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AmenitiesInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Our Recreation Center features various amenities including:
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Basketball Court</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AmenitiesInfo;
