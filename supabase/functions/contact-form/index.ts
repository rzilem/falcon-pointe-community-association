import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting - store IP addresses and timestamps
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []
  
  // Clean old requests
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }
  
  // Add current request
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  
  return false
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .substring(0, 1000) // Limit length
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before submitting again.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      })
    }

    const { name, email, message } = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        error: 'All fields are required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email address' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
      subject: 'Website Contact Form Submission'
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert message into database
    const { data, error } = await supabase
      .from('messages')
      .insert([sanitizedData])
      .select()
      .single()

    if (error) {
      console.error('Error inserting message:', error)
      throw error
    }

    console.log('Contact form submission received:', {
      id: data.id,
      name: sanitizedData.name,
      email: sanitizedData.email,
      messageLength: sanitizedData.message.length
    })

    return new Response(JSON.stringify({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      id: data.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred while sending your message. Please try again later.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

serve(handler)