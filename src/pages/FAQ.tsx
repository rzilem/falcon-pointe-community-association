
import React from "react";
import Layout from "@/components/layout/Layout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="fees" className="bg-white rounded-lg shadow-sm">
            <AccordionTrigger className="px-4">HOA Fees & Payments</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Assessment Fees</h3>
                  <p>HOA dues are $95.00 per month and are due on the 1st.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Methods</h3>
                  <p>Payments can be made through:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Online through <a href="mailto:owner@psprop.net" className="text-primary hover:underline">owner@psprop.net</a></li>
                    <li>Mail to: Falcon Pointe Community Association, Inc., PO Box 65583, Phoenix, AZ 85082</li>
                    <li>Auto-draft available through <a href="mailto:owner@psprop.net" className="text-primary hover:underline">owner@psprop.net</a></li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="compliance" className="bg-white rounded-lg shadow-sm">
            <AccordionTrigger className="px-4">Property Compliance & Modifications</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Architectural Changes</h3>
                  <p>All exterior modifications require prior approval from the Architectural Review Committee (ARC).</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Submit requests through <a href="https://owner.psprop.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">owner.psprop.net</a>, under the Requests tab</li>
                    <li>Include detailed plans and specifications</li>
                    <li>Allow up to 30 days for review</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="amenities" className="bg-white rounded-lg shadow-sm">
            <AccordionTrigger className="px-4">Community Amenities</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Pool Access</h3>
                  <p>The pool is accessible to all residents in good standing with their HOA dues.</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Hours: 365 days a year, 24 hours a day</li>
                    <li>Access cards available through the Falcon Pointe Office Staff</li>
                    <li>Pool rules must be followed at all times</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contact" className="bg-white rounded-lg shadow-sm">
            <AccordionTrigger className="px-4">Contact Information</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Management Company</h3>
                  <p><strong>PS Property Management</strong></p>
                  <p>For questions or concerns, contact:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Phone: <a href="tel:+15126701400" className="text-primary hover:underline">(512) 670-1400</a></li>
                    <li>Email: <a href="mailto:manager@falconpointecommunity.com" className="text-primary hover:underline">manager@falconpointecommunity.com</a></li>
                    <li>Office Hours: Monday - Friday: 9:00 AM - 5:00 PM</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
};

export default FAQ;
