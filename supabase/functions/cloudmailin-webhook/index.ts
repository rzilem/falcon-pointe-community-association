
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CloudmailinWebhook {
  envelope: {
    to: string;
    from: string;
    recipients: string[];
  };
  plain: string;
  html: string;
  subject: string;
  date: string;
  headers: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received Cloudmailin webhook");
    console.log("Request method:", req.method);
    console.log("Content-Type:", req.headers.get("content-type"));
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let webhookData: CloudmailinWebhook;
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Handle JSON format
      webhookData = await req.json();
      console.log("Parsed as JSON:", webhookData);
    } else if (contentType.includes("multipart/form-data")) {
      // Handle multipart form data
      const formData = await req.formData();
      console.log("Received form data with keys:", Array.from(formData.keys()));
      
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
      
      // Extract data from form
      webhookData = {
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
      
      console.log("Parsed form data:", {
        subject: webhookData.subject,
        hasHtml: !!webhookData.html,
        hasPlain: !!webhookData.plain,
        from: webhookData.envelope.from
      });
    } else {
      // Fallback: try to parse as URL-encoded form data
      const rawBody = await req.text();
      console.log("Raw body received:", rawBody.substring(0, 500) + "...");
      
      const formData = new URLSearchParams(rawBody);
      
      // Extract subject from multiple possible locations
      let subject = formData.get('subject') || '';
      if (!subject) {
        subject = formData.get('headers[subject]') || '';
      }
      
      webhookData = {
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
    
    console.log("Processing email:", {
      subject: webhookData.subject,
      from: webhookData.envelope?.from,
      to: webhookData.envelope?.to,
      date: webhookData.date
    });

    // Validate required fields - if still no subject, create a fallback
    if (!webhookData.subject || webhookData.subject.trim() === '') {
      console.log("No subject found, creating fallback subject");
      webhookData.subject = `Announcement - ${new Date().toLocaleDateString()}`;
    }

    // Create the announcement from the email
    const announcementData = {
      section: `announcement-${Date.now()}`, // Unique section identifier
      title: webhookData.subject,
      content: webhookData.html || webhookData.plain || '', // Use HTML if available, fallback to plain text
      section_type: "blog",
      category: "announcements",
      active: true, // Auto-publish as requested
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Creating announcement with data:", announcementData);

    // Insert the announcement into the site_content table
    const { data, error } = await supabase
      .from("site_content")
      .insert(announcementData)
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }

    console.log("Successfully created announcement:", data);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Announcement created successfully",
        announcement_id: data.id,
        title: data.title
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error processing Cloudmailin webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: "Failed to create announcement from email"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
