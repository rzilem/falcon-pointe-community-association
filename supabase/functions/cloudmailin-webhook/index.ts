
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { parseWebhookData } from './emailParser.ts';
import { extractCleanContent } from './contentCleaner.ts';
import { AnnouncementData } from './types.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Parse the webhook data
    const webhookData = await parseWebhookData(req);
    
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

    // Clean the email content to extract only meaningful text
    const cleanContent = extractCleanContent(webhookData.html, webhookData.plain);
    
    console.log("Content cleaning result:", {
      originalHtmlLength: webhookData.html?.length || 0,
      originalPlainLength: webhookData.plain?.length || 0,
      cleanContentLength: cleanContent.length,
      cleanContentPreview: cleanContent.substring(0, 200) + "..."
    });

    // Get the default announcement image from site_images
    let featuredImagePath = null;
    try {
      const { data: defaultImage } = await supabase
        .from('site_images')
        .select('path')
        .eq('location', 'announcement-default')
        .eq('active', true)
        .limit(1)
        .maybeSingle();
      
      if (defaultImage) {
        // Get the public URL for the default image
        const { data: urlData } = supabase.storage
          .from('site-images')
          .getPublicUrl(defaultImage.path);
        
        featuredImagePath = urlData.publicUrl;
        console.log("Using default announcement image:", featuredImagePath);
      } else {
        console.log("No default announcement image found");
      }
    } catch (error) {
      console.log("Error fetching default announcement image:", error);
      // Continue without featured image
    }

    // Create the announcement from the email
    const announcementData: AnnouncementData = {
      section: `announcement-${Date.now()}`, // Unique section identifier
      title: webhookData.subject,
      content: cleanContent || 'No content available', // Use cleaned content
      section_type: "blog",
      category: "announcements",
      active: true, // Auto-publish as requested
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add featured image if we have the default one
    const insertData = featuredImagePath 
      ? { ...announcementData, featured_image: featuredImagePath }
      : announcementData;

    console.log("Creating announcement with data:", {
      section: insertData.section,
      title: insertData.title,
      contentLength: insertData.content.length,
      contentPreview: insertData.content.substring(0, 150) + "...",
      featuredImage: featuredImagePath ? "Default image assigned" : "No image"
    });

    // Insert the announcement into the site_content table
    const { data, error } = await supabase
      .from("site_content")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }

    console.log("Successfully created announcement:", {
      id: data.id,
      title: data.title,
      contentLength: data.content?.length || 0,
      featuredImage: data.featured_image ? "Image included" : "No image"
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Announcement created successfully",
        announcement_id: data.id,
        title: data.title,
        featured_image: data.featured_image ? "Default image assigned" : "No image assigned"
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
