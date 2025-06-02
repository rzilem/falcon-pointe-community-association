
import { CloudmailinWebhook } from './types.ts';

/**
 * Parses different types of webhook data formats from Cloudmailin
 */
export async function parseWebhookData(req: Request): Promise<CloudmailinWebhook> {
  const contentType = req.headers.get("content-type") || "";
  
  if (contentType.includes("application/json")) {
    // Handle JSON format
    const webhookData = await req.json();
    console.log("Parsed as JSON:", webhookData);
    return webhookData;
  } 
  
  if (contentType.includes("multipart/form-data")) {
    // Handle multipart form data
    const formData = await req.formData();
    console.log("Received form data with keys:", Array.from(formData.keys()));
    
    return parseFormData(formData);
  }
  
  // Fallback: try to parse as URL-encoded form data
  const rawBody = await req.text();
  console.log("Raw body received:", rawBody.substring(0, 500) + "...");
  
  const formData = new URLSearchParams(rawBody);
  return parseUrlEncodedData(formData);
}

function parseFormData(formData: FormData): CloudmailinWebhook {
  // Extract subject from multiple possible locations
  let subject = formData.get('subject')?.toString() || '';
  if (!subject) {
    subject = formData.get('headers[subject]')?.toString() || '';
  }
  
  console.log("Subject extraction debug:", {
    directSubject: formData.get('subject')?.toString(),
    headerSubject: formData.get('headers[subject]')?.toString(),
    finalSubject: subject
  });
  
  return {
    envelope: {
      to: formData.get('envelope[to]')?.toString() || '',
      from: formData.get('envelope[from]')?.toString() || '',
      recipients: formData.get('envelope[recipients]')?.toString().split(',') || []
    },
    plain: formData.get('plain')?.toString() || '',
    html: formData.get('html')?.toString() || '',
    subject: subject,
    date: formData.get('date')?.toString() || formData.get('headers[date]')?.toString() || new Date().toISOString(),
    headers: {}
  };
}

function parseUrlEncodedData(formData: URLSearchParams): CloudmailinWebhook {
  // Extract subject from multiple possible locations
  let subject = formData.get('subject') || '';
  if (!subject) {
    subject = formData.get('headers[subject]') || '';
  }
  
  return {
    envelope: {
      to: formData.get('envelope[to]') || '',
      from: formData.get('envelope[from]') || '',
      recipients: formData.get('envelope[recipients]')?.split(',') || []
    },
    plain: formData.get('plain') || '',
    html: formData.get('html') || '',
    subject: subject,
    date: formData.get('date') || formData.get('headers[date]') || new Date().toISOString(),
    headers: {}
  };
}
