
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers to allow cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for email request data
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { to, subject, html, from, text }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    // Send email through Resend
    const emailResponse = await resend.emails.send({
      from: from || "Neighborhood HOA <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
      text: text,
    });

    console.log("Email sent successfully:", emailResponse);

    // Return success response
    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Start the server
serve(handler);
