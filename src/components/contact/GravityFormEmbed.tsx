
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import "./GravityFormBase.css";
import "./GravityFormFields.css";
import "./GravityFormCalendar.css";
import "./GravityFormResponsive.css";

// Extend Window interface to include jQuery
declare global {
  interface Window {
    jQuery?: any;
  }
}

const GravityFormEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [calendarLoaded, setCalendarLoaded] = useState(false);

  useEffect(() => {
    // Load jQuery UI CSS for calendar widgets
    const jqueryUICSS = document.createElement("link");
    jqueryUICSS.rel = "stylesheet";
    jqueryUICSS.href = "https://code.jquery.com/ui/1.13.2/themes/ui-lightness/jquery-ui.css";
    document.head.appendChild(jqueryUICSS);

    // Load jQuery if not already loaded
    const loadjQuery = () => {
      if (typeof window.jQuery === 'undefined') {
        const jqueryScript = document.createElement("script");
        jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        jqueryScript.onload = loadjQueryUI;
        document.head.appendChild(jqueryScript);
      } else {
        loadjQueryUI();
      }
    };

    // Load jQuery UI for calendar functionality
    const loadjQueryUI = () => {
      if (typeof window.jQuery !== 'undefined' && !window.jQuery.datepicker) {
        const jqueryUIScript = document.createElement("script");
        jqueryUIScript.src = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
        jqueryUIScript.onload = () => {
          console.log('jQuery UI loaded for calendar support');
          setCalendarLoaded(true);
        };
        document.head.appendChild(jqueryUIScript);
      } else {
        setCalendarLoaded(true);
      }
    };

    // Create script element for Gravity Form functionality with HTTPS
    const script = document.createElement("script");
    script.src = "https://psprop.net/wp-content/plugins/gravity-forms-iframe-master/assets/scripts/gfembed.min.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = () => {
      console.log('Gravity Forms script loaded successfully');
      loadjQuery();
    };
    
    script.onerror = () => {
      console.error('Failed to load Gravity Forms script');
      loadjQuery(); // Still try to load calendar support
    };
    
    // Append script to document head for better loading
    document.head.appendChild(script);

    // Listen for calendar-related messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'calendar-interaction') {
        console.log('Calendar interaction detected:', event.data);
        // Force visibility of calendar elements
        setTimeout(() => {
          const calendarElements = document.querySelectorAll('.hasDatepicker, .ui-datepicker, .gfield_calendar');
          calendarElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.display = 'block';
            htmlEl.style.visibility = 'visible';
            htmlEl.style.opacity = '1';
          });
        }, 100);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(jqueryUICSS)) {
        document.head.removeChild(jqueryUICSS);
      }
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Contact form iframe loaded successfully');
    
    // Post-load calendar enhancement
    setTimeout(() => {
      const iframe = document.querySelector('.gfiframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          // Inject calendar enhancement script into iframe
          iframe.contentWindow.postMessage({
            type: 'enhance-calendar',
            calendarReady: calendarLoaded
          }, '*');
        } catch (e) {
          console.log('Cross-origin restrictions prevent direct iframe access');
        }
      }
    }, 1000);
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
                {!calendarLoaded && (
                  <p className="mt-1 text-sm text-gray-500">Preparing calendar components...</p>
                )}
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
