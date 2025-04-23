
import React from 'react';
import { useContent } from '@/hooks/useContent';

interface ContentDisplayProps {
  section: string;
  className?: string;
  fallbackTitle?: string;
  fallbackContent?: string | React.ReactNode;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ 
  section, 
  className = '',
  fallbackTitle,
  fallbackContent
}) => {
  const { content, isLoading, error } = useContent(section);

  if (isLoading) {
    return <div className={`animate-pulse ${className}`}>Loading content...</div>;
  }

  if (error) {
    return <div className={className}>{fallbackContent || 'Content unavailable'}</div>;
  }

  // If there's no content and no fallback, return null
  if (!content && !fallbackTitle && !fallbackContent) {
    return null;
  }

  return (
    <div className={className}>
      {(content?.title || fallbackTitle) && (
        <h2 className="text-2xl font-bold mb-4">{content?.title || fallbackTitle}</h2>
      )}
      {content?.content ? (
        <div className="prose max-w-none">{content.content}</div>
      ) : (
        <>{fallbackContent}</>
      )}
    </div>
  );
};

export default ContentDisplay;
