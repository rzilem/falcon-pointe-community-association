
import React, { useEffect } from 'react';
import { gravityFormsLogger } from '@/utils/gravityFormsLogger';

interface GravityFormsMonitorProps {
  activeTab?: string;
}

const GravityFormsMonitor: React.FC<GravityFormsMonitorProps> = ({ activeTab }) => {
  useEffect(() => {
    gravityFormsLogger.log('info', 'iframe', 'GravityFormsMonitor initialized', { activeTab });

    // Monitor iframe load events
    const handleIframeLoad = (event: Event) => {
      const iframe = event.target as HTMLIFrameElement;
      if (iframe.src?.includes('gfembed')) {
        gravityFormsLogger.log('info', 'iframe', 'Gravity Forms iframe loaded', {
          src: iframe.src,
          width: iframe.width,
          height: iframe.height
        });

        // Try to detect calendar widgets after iframe loads
        setTimeout(() => {
          try {
            // Check if iframe content is accessible (may fail due to CORS)
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const calendarElements = iframeDoc.querySelectorAll('[class*="calendar"], [class*="date"], [id*="date"], select[name*="date"]');
              gravityFormsLogger.log('info', 'calendar', 'Calendar elements detected', {
                count: calendarElements.length,
                elements: Array.from(calendarElements).map(el => ({
                  tagName: el.tagName,
                  className: el.className,
                  id: el.id
                }))
              });
            }
          } catch (error) {
            gravityFormsLogger.log('warn', 'dom', 'Cannot access iframe content (CORS restriction)', { error: error.message });
          }
        }, 1000);
      }
    };

    // Monitor iframe errors
    const handleIframeError = (event: Event) => {
      const iframe = event.target as HTMLIFrameElement;
      if (iframe.src?.includes('gfembed')) {
        gravityFormsLogger.log('error', 'iframe', 'Gravity Forms iframe failed to load', {
          src: iframe.src,
          error: event
        });
      }
    };

    // Add global iframe listeners
    document.addEventListener('load', handleIframeLoad, true);
    document.addEventListener('error', handleIframeError, true);

    // Monitor for new iframes being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const iframes = node.querySelectorAll('iframe[src*="gfembed"]');
            iframes.forEach((iframe) => {
              gravityFormsLogger.log('info', 'dom', 'New Gravity Forms iframe detected', {
                src: (iframe as HTMLIFrameElement).src
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Monitor network requests (if possible)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url] = args;
      if (typeof url === 'string' && url.includes('gfembed')) {
        gravityFormsLogger.log('info', 'network', 'Gravity Forms network request', { url });
      }
      return originalFetch.apply(window, args);
    };

    return () => {
      document.removeEventListener('load', handleIframeLoad, true);
      document.removeEventListener('error', handleIframeError, true);
      observer.disconnect();
      window.fetch = originalFetch;
    };
  }, [activeTab]);

  return null;
};

export default GravityFormsMonitor;
