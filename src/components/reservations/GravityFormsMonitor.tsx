
import React, { useEffect } from 'react';
import { gravityFormsLogger } from '@/utils/gravityFormsLogger';

interface GravityFormsMonitorProps {
  activeTab?: string;
}

const GravityFormsMonitor: React.FC<GravityFormsMonitorProps> = ({ activeTab }) => {
  useEffect(() => {
    gravityFormsLogger.log('info', 'iframe', 'GravityFormsMonitor initialized', { activeTab });

    // Monitor Gravity Forms script loading
    const checkGravityScript = () => {
      const script = document.head.querySelector('script[src*="gfembed.min.js"]');
      if (script) {
        gravityFormsLogger.log('info', 'network', 'Gravity Forms script found in DOM', {
          src: (script as HTMLScriptElement).src
        });
      } else {
        gravityFormsLogger.log('warn', 'network', 'Gravity Forms script not found in DOM');
      }
    };

    // Check script presence after a delay
    setTimeout(checkGravityScript, 1000);

    // Monitor iframe load events with enhanced logging
    const handleIframeLoad = (event: Event) => {
      const iframe = event.target as HTMLIFrameElement;
      if (iframe.src?.includes('gfembed')) {
        gravityFormsLogger.log('info', 'iframe', 'Gravity Forms iframe loaded successfully', {
          src: iframe.src,
          width: iframe.width,
          height: iframe.height,
          protocol: iframe.src.startsWith('https://') ? 'HTTPS' : 'Other'
        });

        // Try to detect form elements after iframe loads
        setTimeout(() => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const formElements = iframeDoc.querySelectorAll('form, input, select, textarea');
              const calendarElements = iframeDoc.querySelectorAll('[class*="calendar"], [class*="date"], [id*="date"], select[name*="date"]');
              
              gravityFormsLogger.log('info', 'calendar', 'Form elements detected in iframe', {
                formElementsCount: formElements.length,
                calendarElementsCount: calendarElements.length,
                hasGravityForm: !!iframeDoc.querySelector('.gform_wrapper')
              });
            }
          } catch (error) {
            gravityFormsLogger.log('warn', 'dom', 'Cannot access iframe content due to CORS', { 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }, 2000);
      }
    };

    // Monitor iframe errors with enhanced logging
    const handleIframeError = (event: Event) => {
      const iframe = event.target as HTMLIFrameElement;
      if (iframe.src?.includes('gfembed')) {
        gravityFormsLogger.log('error', 'iframe', 'Gravity Forms iframe failed to load', {
          src: iframe.src,
          protocol: iframe.src.startsWith('https://') ? 'HTTPS' : 'Other',
          error: 'Load failed'
        });
      }
    };

    // Add global iframe listeners
    document.addEventListener('load', handleIframeLoad, true);
    document.addEventListener('error', handleIframeError, true);

    // Monitor for new iframes being added with enhanced detection
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const iframes = node.querySelectorAll('iframe[src*="gfembed"]');
            iframes.forEach((iframe) => {
              const htmlIframe = iframe as HTMLIFrameElement;
              gravityFormsLogger.log('info', 'dom', 'New Gravity Forms iframe detected in DOM', {
                src: htmlIframe.src,
                protocol: htmlIframe.src.startsWith('https://') ? 'HTTPS' : 'Other',
                hasProperURL: htmlIframe.src.startsWith('https://psprop.net/')
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

    // Monitor network requests with protocol detection
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url] = args;
      if (typeof url === 'string' && (url.includes('gfembed') || url.includes('psprop.net'))) {
        gravityFormsLogger.log('info', 'network', 'Gravity Forms network request detected', { 
          url,
          protocol: url.startsWith('https://') ? 'HTTPS' : 'Other'
        });
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

  // Log tab changes
  useEffect(() => {
    if (activeTab) {
      gravityFormsLogger.log('info', 'iframe', 'Tab changed - monitoring form loading', { 
        activeTab,
        timestamp: new Date().toISOString()
      });
    }
  }, [activeTab]);

  return null;
};

export default GravityFormsMonitor;
