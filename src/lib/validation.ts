import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name contains invalid characters" }),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  
  subject: z.string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" })
});

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  
  content: z.string()
    .trim()
    .min(10, { message: "Content must be at least 10 characters" }),
  
  category: z.string()
    .trim()
    .optional(),
  
  featured_image: z.string()
    .url({ message: "Featured image must be a valid URL" })
    .optional()
    .or(z.literal(''))
});

// Event validation schema
export const eventSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  
  description: z.string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" }),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
  
  time: z.string()
    .trim()
    .min(1, { message: "Time is required" }),
  
  location: z.string()
    .trim()
    .min(1, { message: "Location is required" })
    .max(200, { message: "Location must be less than 200 characters" }),
  
  category: z.string()
    .trim()
    .optional()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type BlogPostData = z.infer<typeof blogPostSchema>;
export type EventData = z.infer<typeof eventSchema>;