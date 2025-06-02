
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

    // Get the raw body first to debug
    const rawBody = await req.text();
    console.log("Raw body received:", rawBody);
    
    let webhookData: CloudmailinWebhook;
    
    try {
      // Try to parse as JSON first
      webhookData = JSON.parse(rawBody);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      console.log("Attempting to parse as form data...");
      
      // If JSON parsing fails, try parsing as form data
      const formData = new URLSearchParams(rawBody);
      
      // Convert form data to our expected format
      webhookData = {
        envelope: {
          to: formData.get('envelope[to]') || '',
          from: formData.get('envelope[from]') || '',
          recipients: formData.get('envelope[recipients]')?.split(',') || []
        },
        plain: formData.get('plain') || '',
        html: formData.get('html') || '',
        subject: formData.get('subject') || '',
        date: formData.get('date') || new Date().toISOString(),
        headers: {}
      };
    }
    
    console.log("Processing email:", {
      subject: webhookData.subject,
      from: webhookData.envelope?.from,
      to: webhookData.envelope?.to,
      date: webhookData.date
    });

    // Validate required fields
    if (!webhookData.subject) {
      throw new Error("No subject found in email data");
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
