
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const GravityFormEmbed = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="w-full">
          <iframe 
            src="about:blank" // Replace with actual Gravity Form URL
            height="500" 
            width="100%" 
            title="Contact Form" 
            style={{ border: "none" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GravityFormEmbed;
