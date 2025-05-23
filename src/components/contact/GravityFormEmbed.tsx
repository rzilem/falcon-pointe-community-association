
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import "./GravityFormStyles.css";

const GravityFormEmbed = () => {
  useEffect(() => {
    // Create script element for Gravity Form functionality
    const script = document.createElement("script");
    script.src = "/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Append script to document body
    document.body.appendChild(script);
    
    // Clean up when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="gravity-form-card">
      <CardContent className="p-6 md:p-8">
        <div className="w-full gravity-form-container">
          <iframe 
            src="//psprop.net/gfembed/?f=34" 
            width="100%" 
            height="840" 
            frameBorder="0" 
            className="gfiframe"
            title="Contact Form"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GravityFormEmbed;
