
/**
 * Cleans and extracts meaningful content from email HTML
 * Removes HTML tags, styles, scripts, and other markup to extract plain text
 */
export function extractCleanContent(htmlContent: string, plainContent: string): string {
  if (!htmlContent && !plainContent) {
    return '';
  }
  
  // If we have plain text, use it as a fallback
  if (!htmlContent && plainContent) {
    return plainContent.trim();
  }
  
  try {
    // Remove HTML tags and decode entities
    let cleanText = htmlContent
      // Remove script and style elements completely
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove meta tags, title, and other head elements
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<title[^>]*>.*?<\/title>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      // Remove XML declarations and Office document settings
      .replace(/<\?xml[^>]*>/gi, '')
      .replace(/<o:[^>]*>/gi, '')
      .replace(/<\/o:[^>]*>/gi, '')
      // Convert br tags to line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove all remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode common HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Remove multiple whitespace/newlines
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // If we extracted something meaningful, return it
    if (cleanText && cleanText.length > 10) {
      return cleanText;
    }
  } catch (error) {
    console.log("Error cleaning HTML content:", error);
  }
  
  // Fallback to plain text if HTML cleaning failed or resulted in empty content
  return plainContent ? plainContent.trim() : '';
}
