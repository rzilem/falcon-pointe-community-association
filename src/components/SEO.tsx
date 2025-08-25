
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = 'Highpointe POA of Dripping Springs - A gated master-planned community in the beautiful Hill Country of Southwest Austin, TX with exceptional amenities.',
  keywords = 'Highpointe POA, Dripping Springs, Hill Country, Austin TX, gated community, master-planned community, amenities, HOA',
  ogImage = '/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png',
  ogUrl,
  twitterCard = 'summary_large_image'
}) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Highpointe POA of Dripping Springs`;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: ogUrl || window.location.href },
      { property: 'twitter:card', content: twitterCard },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: ogImage }
    ];
    
    metaTags.forEach(({ name, property, content }) => {
      // Check if the meta tag already exists
      const metaSelector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(metaSelector);
      
      if (meta) {
        // Update existing tag
        meta.setAttribute('content', content);
      } else {
        // Create new tag
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
    
    // Cleanup function
    return () => {
      // No need to remove meta tags as they'll be updated or reused
      document.title = 'Highpointe POA of Dripping Springs';
    };
  }, [title, description, keywords, ogImage, ogUrl, twitterCard]);
  
  return null; // This component doesn't render anything
};

export default SEO;
