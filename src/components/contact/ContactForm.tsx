import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/validation";
import { useSecureSubmit } from "@/hooks/useSecureSubmit";
import FormField from "./form/FormField";

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const { submitContactForm, isLoading } = useSecureSubmit();

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<ContactFormData> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatusMessage("Please fix the errors above.");
      return;
    }

    await submitContactForm(formData as { name: string; email: string; subject: string; message: string }, {
      onSuccess: () => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setStatusMessage("Message sent successfully! We'll get back to you as soon as possible.");
      },
      onError: (error: string) => {
        setStatusMessage(error);
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {statusMessage}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            error={errors.name}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          <FormField
            label="Subject"
            name="subject"
            placeholder="Message subject"
            value={formData.subject}
            onChange={handleChange}
            required
            error={errors.subject}
          />
          <FormField
            label="Message"
            name="message"
            type="textarea"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            required
            error={errors.message}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
