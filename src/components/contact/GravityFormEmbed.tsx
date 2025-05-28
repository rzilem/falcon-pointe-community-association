
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import "./GravityFormBase.css";
import "./GravityFormFields.css";
import "./GravityFormCalendar.css";
import "./GravityFormResponsive.css";

const GravityFormEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Create script element for Gravity Form functionality with HTTPS
    const script = document.createElement("script");
    script.src = "https://psprop.net/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = () => {
      console.log('Gravity Forms script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Gravity Forms script');
    };
    
    // Append script to document head for better loading
    document.head.appendChild(script);
    
    // Clean up when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Contact form iframe loaded successfully');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Contact form iframe failed to load');
  };

  return (
    <Card className="gravity-form-card">
      <CardContent className="p-6 md:p-8">
        <div className="w-full gravity-form-container">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading contact form...</p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">Unable to load contact form. Please refresh the page or contact us directly.</p>
            </div>
          )}
          
          <iframe 
            src="https://psprop.net/gfembed/?f=34" 
            width="100%" 
            height="840" 
            frameBorder="0" 
            className="gfiframe"
            title="Contact Form"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading || hasError ? 'none' : 'block' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GravityFormEmbed;
