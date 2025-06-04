
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
  
  let processedContent = content;
  
  if (truncate) {
    // Create a temporary div to get plain text for truncation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || '';
    
    // Truncate text content if needed
    if (textContent.length > maxLength) {
      const truncatedText = textContent.substring(0, maxLength) + '...';
      processedContent = truncatedText;
    }
  }
  
  // Configure DOMPurify to allow more HTML elements for rich email content
  const purifyConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'table', 'tr', 'td', 
      'th', 'thead', 'tbody', 'tfoot', 'pre', 'code'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'style', 'class', 'target', 'rel',
      'width', 'height', 'border', 'cellpadding', 'cellspacing'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  };
  
  // Sanitize the HTML to prevent XSS attacks while preserving formatting
  const cleanContent = DOMPurify.sanitize(processedContent, purifyConfig);
  
  return (
    <div 
      className={`rich-content prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }} 
    />
  );
};

export default RichContentRenderer;
