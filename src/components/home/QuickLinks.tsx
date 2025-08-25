
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QuickLinks = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Management Team */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Contact Mgmt Team</h3>
              <p className="text-gray-600">Have questions or concerns? Contact our community management team for assistance and support.</p>
              <Button variant="default" asChild className="w-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Pool & Gate Access */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-secondary/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Pool & Gate Access</h3>
              <p className="text-gray-600">Manage your pool and gate access credentials for our gated community amenities.</p>
              <Button variant="default" asChild className="w-full">
                <Link to="/contact">Get Access</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* ARC Application */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-accent/10 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">ARC Application</h3>
              <p className="text-gray-600">Submit your Architectural Review Committee application for home improvements and modifications.</p>
              <Button variant="default" asChild className="w-full">
                <Link to="/documents">Apply Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
