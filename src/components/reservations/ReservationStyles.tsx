
import React from 'react';

const ReservationStyles = () => {
  return (
    <style jsx global>{`
      .calendly-inline-widget iframe {
        height: 100% !important;
        min-height: 600px !important;
      }
      
      /* Ensure Calendly doesn't add scrollbars */
      .calendly-badge-widget {
        margin-bottom: 0 !important;
      }
    `}</style>
  );
};

export default ReservationStyles;
