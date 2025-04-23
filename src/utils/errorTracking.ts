
// Basic error tracking utility

interface ErrorTrackingOptions {
  context?: Record<string, any>;
  user?: {
    id?: string;
    role?: string;
  };
}

// Create a queue to store errors
const errorQueue: Array<{
  error: Error;
  timestamp: string;
  context?: Record<string, any>;
  user?: {
    id?: string;
    role?: string;
  };
}> = [];

// Initialize error tracking
export const initErrorTracking = () => {
  // Add global error handler
  window.addEventListener('error', (event) => {
    captureError(event.error, { context: { message: event.message } });
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    captureError(new Error(event.reason || 'Promise rejected'), { 
      context: { type: 'unhandledrejection' }
    });
  });
  
  // Log initialization
  console.log('Error tracking initialized');
};

// Capture an error
export const captureError = (error: Error, options: ErrorTrackingOptions = {}) => {
  // Add error to queue
  errorQueue.push({
    error,
    timestamp: new Date().toISOString(),
    context: options.context,
    user: options.user
  });
  
  // Log error to console in development
  if (import.meta.env.DEV) {
    console.error('[Error Tracking]', error, options);
  }
  
  // In a real implementation, we would periodically send errors to a server
  // Or integrate with a service like Sentry
};

// Get current error queue
export const getErrorQueue = () => {
  return [...errorQueue];
};

// Clear error queue
export const clearErrorQueue = () => {
  errorQueue.length = 0;
};
