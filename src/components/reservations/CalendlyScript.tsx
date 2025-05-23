
import React, { useEffect } from 'react';

const CalendlyScript = () => {
  useEffect(() => {
    // Load the Calendly script if not already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        // Cleanup script if component unmounts
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
    
    // Function to reinitialize Calendly widgets
    const reinitializeCalendly = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/falconpointe/pool-pavilion?hide_gdpr_banner=1',
          parentElement: document.querySelector('.calendly-pool-pavilion'),
          prefill: {},
          utm: {}
        });
        
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/falconpointe/30min?hide_gdpr_banner=1',
          parentElement: document.querySelector('.calendly-event-room'),
          prefill: {},
          utm: {}
        });
      }
    };

    // Add listeners for tab changes
    const tabTriggers = document.querySelectorAll('[role="tab"]');
    tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        // Slight delay to ensure DOM is updated
        setTimeout(reinitializeCalendly, 200);
      });
    });

    // Initialize on first load
    const intervalId = setInterval(() => {
      if (window.Calendly) {
        reinitializeCalendly();
        clearInterval(intervalId);
      }
    }, 300);

    return () => {
      // Cleanup event listeners
      tabTriggers.forEach(trigger => {
        trigger.removeEventListener('click', reinitializeCalendly);
      });
      clearInterval(intervalId);
    };
  }, []);

  return null;
};

// Add this type definition for the Calendly global object
declare global {
  interface Window {
    Calendly: any;
  }
}

export default CalendlyScript;
