
import React from 'react';

const ReservationStyles = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      .calendly-inline-widget iframe {
        height: 100% !important;
        min-height: 700px !important;
      }
      
      /* Ensure Calendly doesn't add scrollbars */
      .calendly-badge-widget {
        margin-bottom: 0 !important;
      }

      /* Override Radix UI's default behavior to improve Calendly rendering */
      [role="tabpanel"][data-state="inactive"] {
        display: none;
      }
      
      /* Force styles to ensure calendly widgets are fully visible */
      .calendly-inline-widget {
        position: relative !important;
        min-width: 320px;
        height: 100%;
      }

      /* Improve visibility during tab switching */
      .calendly-tab-content {
        transition: opacity 0.2s ease-out;
      }
      
      .calendly-tab-content[data-state="active"] {
        opacity: 1;
      }
      
      .calendly-tab-content[data-state="inactive"] {
        opacity: 0;
        pointer-events: none;
        position: absolute;
      }
    `}} />
  );
};

export default ReservationStyles;
