
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
                  <p>HOA dues are $[AMOUNT] per [PERIOD] and are due on [DATE].</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Methods</h3>
                  <p>Payments can be made through:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Online through [PAYMENT_SYSTEM]</li>
                    <li>Mail to: [MAILING_ADDRESS]</li>
                    <li>Auto-draft available through [SYSTEM_NAME]</li>
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
                    <li>Submit requests through [SYSTEM_NAME]</li>
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
                    <li>Hours: [POOL_HOURS]</li>
                    <li>Access cards available through [CONTACT_INFO]</li>
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
                  <p>For questions or concerns, contact:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Phone: [PHONE_NUMBER]</li>
                    <li>Email: [EMAIL_ADDRESS]</li>
                    <li>Office Hours: [OFFICE_HOURS]</li>
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
