
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { parseWebhookData } from './emailParser.ts';
import { cleanEmailSubject } from './subjectCleaner.ts';
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
    // Verify webhook authentication
    const authHeader = req.headers.get('authorization')
    const webhookSecret = Deno.env.get('CLOUDMAILIN_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      console.error('CLOUDMAILIN_WEBHOOK_SECRET not configured')
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Unauthorized webhook request')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log("Received authenticated Cloudmailin webhook");
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

    // Clean the email subject to make it user-friendly
    const cleanedSubject = cleanEmailSubject(webhookData.subject);
    console.log("Cleaned subject:", cleanedSubject);

    // Use HTML content if available, fallback to plain text, then sanitize
    const rawContent = webhookData.html || webhookData.plain || 'No content available';
    
    // Sanitize content to prevent XSS and other attacks
    const emailContent = rawContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes  
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove objects
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embeds
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/<link\b[^>]*>/gi, '') // Remove link tags
      .replace(/<meta\b[^>]*>/gi, '') // Remove meta tags
      .substring(0, 10000); // Limit content length
    
    console.log("Content processing result:", {
      originalHtmlLength: webhookData.html?.length || 0,
      originalPlainLength: webhookData.plain?.length || 0,
      usingHtml: !!webhookData.html,
      contentLength: emailContent.length,
      contentPreview: emailContent.substring(0, 200) + "..."
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
      title: cleanedSubject.substring(0, 200), // Limit title length
      content: emailContent, // Use full HTML content
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
      contentType: webhookData.html ? "HTML" : "Plain text",
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
