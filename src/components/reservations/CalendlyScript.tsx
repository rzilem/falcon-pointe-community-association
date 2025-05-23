
import React, { useEffect, useState } from 'react';

interface CalendlyScriptProps {
  activeTab?: string;
}

const CalendlyScript: React.FC<CalendlyScriptProps> = ({ activeTab }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load the Calendly script
  useEffect(() => {
    // Load the Calendly script if not already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        // Cleanup script if component unmounts
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // Initialize and reinitialize Calendly widgets when script is loaded or tab changes
  useEffect(() => {
    if (!isScriptLoaded) return;

    // Function to reinitialize Calendly widgets
    const reinitializeCalendly = () => {
      if (!window.Calendly) {
        console.log("Calendly not loaded yet");
        return;
      }

      console.log("Reinitializing Calendly widgets for tab:", activeTab);
      
      // Pool Pavilion widget
      const poolPavilionElement = document.querySelector('.calendly-pool-pavilion');
      if (poolPavilionElement) {
        try {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/falconpointe/pool-pavilion?hide_gdpr_banner=1',
            parentElement: poolPavilionElement,
            prefill: {},
            utm: {}
          });
          console.log("Pool pavilion widget initialized");
        } catch (e) {
          console.error("Error initializing pool pavilion widget:", e);
        }
      } else {
        console.log("Pool pavilion element not found");
      }
      
      // Event Room widget
      const eventRoomElement = document.querySelector('.calendly-event-room');
      if (eventRoomElement) {
        try {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/falconpointe/30min?hide_gdpr_banner=1',
            parentElement: eventRoomElement,
            prefill: {},
            utm: {}
          });
          console.log("Event room widget initialized");
        } catch (e) {
          console.error("Error initializing event room widget:", e);
        }
      } else {
        console.log("Event room element not found");
      }
    };

    // Initialize Calendly widgets with a delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      reinitializeCalendly();
    }, 500);

    // Setup mutation observer to detect tab content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'data-state' && 
            mutation.target instanceof HTMLElement && 
            mutation.target.getAttribute('data-state') === 'active') {
          console.log("Tab state changed to active, reinitializing...");
          setTimeout(reinitializeCalendly, 300);
        }
      });
    });

    // Observe all tab content elements
    const tabContents = document.querySelectorAll('[role="tabpanel"]');
    tabContents.forEach(content => {
      observer.observe(content, { attributes: true });
    });

    // Add listeners for tab changes
    const tabTriggers = document.querySelectorAll('[role="tab"]');
    tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        console.log("Tab clicked, scheduling reinitialization");
        // Longer delay to ensure DOM is fully updated
        setTimeout(reinitializeCalendly, 400);
      });
    });

    // Return cleanup function
    return () => {
      clearTimeout(initTimeout);
      observer.disconnect();
      tabTriggers.forEach(trigger => {
        trigger.removeEventListener('click', () => setTimeout(reinitializeCalendly, 400));
      });
    };
  }, [isScriptLoaded, activeTab]);

  return null;
};

// Add this type definition for the Calendly global object
declare global {
  interface Window {
    Calendly: any;
  }
}

export default CalendlyScript;
