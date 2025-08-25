
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
  description = 'Falcon Pointe Community Association - A vibrant community in central Texas with exceptional amenities and services.',
  keywords = 'Falcon Pointe, homeowners association, community, amenities, residents, Texas',
  ogImage = '/public/lovable-uploads/899b4f94-1a92-4f7d-a7c0-37faa59f7550.png',
  ogUrl,
  twitterCard = 'summary_large_image'
}) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Falcon Pointe Community Association`;
    
    // Add language attribute to html element
    document.documentElement.lang = 'en';
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: ogUrl || window.location.href },
      { property: 'og:type', content: 'website' },
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
      document.title = 'Falcon Pointe Community Association';
    };
  }, [title, description, keywords, ogImage, ogUrl, twitterCard]);
  
  return null; // This component doesn't render anything
};

export default SEO;
