
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { gravityFormsLogger } from "@/utils/gravityFormsLogger";
import "./GravityFormBase.css";
import "./GravityFormFields.css";
import "./GravityFormCalendar.css";
import "./GravityFormResponsive.css";

const GravityFormEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // Track loading/error state

  // No additional scripts required. The Gravity Forms page is loaded with
  // `jquery=1&jqueryui=1` which ensures jQuery and jQuery UI are available
  // within the iframe itself.

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoading(false);
    setHasError(false);
    
    gravityFormsLogger.log('info', 'iframe', 'Contact form iframe loaded successfully', {
      url: 'https://psprop.net/gfembed/?f=34&jquery=1&jqueryui=1',
      loadTime: performance.now(),
      timestamp: new Date().toISOString()
    });
    
    // Test iframe accessibility
    try {
      const iframe = e.target as HTMLIFrameElement;
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            gravityFormsLogger.log('info', 'iframe', 'Contact form iframe document accessible', {
              title: iframeDoc.title,
              readyState: iframeDoc.readyState,
              hasJQuery: !!(iframe.contentWindow as any)?.jQuery
            });
          } else {
            gravityFormsLogger.log('warn', 'iframe', 'Contact form iframe document not accessible (cross-origin)');
          }
        } catch (err) {
          gravityFormsLogger.log('warn', 'iframe', 'Cross-origin contact form iframe access blocked', { error: (err as Error).message });
        }
      }, 1000);
    } catch (err) {
      gravityFormsLogger.log('error', 'iframe', 'Error testing contact form iframe communication', { error: (err as Error).message });
    }
  };

  const handleIframeError = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIsLoading(false);
    setHasError(true);
    
    gravityFormsLogger.log('error', 'iframe', 'Contact form iframe failed to load', {
      error: e.toString(),
      url: 'https://psprop.net/gfembed/?f=34&jquery=1&jqueryui=1',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href
    });
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
            src="https://psprop.net/gfembed/?f=34&jquery=1&jqueryui=1"
            width="100%" 
            height="840" 
            frameBorder="0" 
            className="gfiframe calendar-enhanced-iframe"
            title="Contact Form"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading || hasError ? 'none' : 'block' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
            allow="fullscreen"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GravityFormEmbed;
