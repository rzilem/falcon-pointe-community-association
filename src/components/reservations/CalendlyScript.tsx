
import React, { useEffect } from 'react';

const CalendlyScript = () => {
  useEffect(() => {
    // Check if script already exists to avoid duplicate loading
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        // Cleanup script if component unmounts
        document.body.removeChild(script);
      };
    }
  }, []);

  return null;
};

export default CalendlyScript;
