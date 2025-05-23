
import React from 'react';
import DOMPurify from 'dompurify';

interface RichContentRendererProps {
  content: string | null;
  className?: string;
  truncate?: boolean;
  maxLength?: number;
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
  truncate = false,
  maxLength = 300
}) => {
  if (!content) return null;
  
  // If we need to truncate, we'll create a text-only version first
  let sanitizedContent = content;
  
  if (truncate) {
    // Create a temporary div to get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || '';
    
    // Truncate text content
    if (textContent.length > maxLength) {
      const truncatedText = textContent.substring(0, maxLength) + '...';
      sanitizedContent = truncatedText;
    }
  }
  
  // Sanitize the HTML to prevent XSS attacks
  const cleanContent = DOMPurify.sanitize(sanitizedContent);
  
  return (
    <div 
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }} 
    />
  );
};

export default RichContentRenderer;
