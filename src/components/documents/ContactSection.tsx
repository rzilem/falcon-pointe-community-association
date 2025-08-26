
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Assistance?</h2>
          <p className="text-gray-600 mb-8">
            If you need help accessing any documents or have questions about their content,
            please contact the management office.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link to="/contact">Contact Management</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
