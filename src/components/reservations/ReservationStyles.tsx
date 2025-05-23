
import React from 'react';

const ReservationStyles = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      .calendly-inline-widget iframe {
        height: 100% !important;
        min-height: 1050px !important;
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
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Remove extra space around Calendly */
      .calendly-container {
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Improve visibility during tab switching */
      .calendly-tab-content {
        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      }
      
      .calendly-tab-content[data-state="active"] {
        opacity: 1;
        transform: translateY(0);
      }
      
      .calendly-tab-content[data-state="inactive"] {
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
        position: absolute;
      }

      /* Add animation for fade in */
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Enhanced tab styles */
      [role="tab"][data-state="active"] {
        background-color: #ffffff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
      }
      
      [role="tab"] {
        transition: all 0.2s ease;
      }

      /* Make images nicer */
      .hover-image {
        transition: transform 0.5s ease;
      }
      
      .hover-image:hover {
        transform: scale(1.05);
      }
    `}} />
  );
};

export default ReservationStyles;
