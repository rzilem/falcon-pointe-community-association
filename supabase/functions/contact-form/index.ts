
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { name, email, subject, message }: ContactFormRequest = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save the message to the database
    const { data, error } = await supabaseClient
      .from("messages")
      .insert([{ name, email, subject, message }])
      .select("id")
      .single();

    if (error) {
      console.error("Error saving message:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save message" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification email to admin
    try {
      // Determine the admin email - this should be configured properly in your environment
      // For now, we'll send a notification back to the sender as a confirmation
      const adminEmail = Deno.env.get("ADMIN_EMAIL") || email; // Fallback to sender's email
      
      // Format the email content
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>You can respond to this message by replying directly to this email or through the admin dashboard.</p>
      `;

      // Call the send-email function
      const sendEmailResponse = await supabaseClient.functions.invoke('send-email', {
        body: { 
          to: adminEmail, 
          subject: `Contact Form: ${subject}`, 
          html: emailHtml,
          from: "Neighborhood HOA <notifications@yourhoa.com>" 
        }
      });

      if (sendEmailResponse.error) {
        // Log the error but don't fail the request
        console.error("Error sending notification email:", sendEmailResponse.error);
      }
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error("Error in email notification process:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been received. We'll get back to you soon.",
        id: data.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
