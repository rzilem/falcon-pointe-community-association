
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QuickLinks = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resident Portal */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Resident Portal</h3>
              <p className="text-gray-600">Access your account, pay assessments, and submit requests through our convenient resident portal.</p>
              <Button variant="default" asChild className="w-full">
                <a 
                  href="https://owner.psprop.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Access Resident Portal (opens in new tab)"
                >
                  Access Portal
                </a>
              </Button>
            </CardContent>
          </Card>
          
          {/* Association Documents */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Association Documents</h3>
              <p className="text-gray-600">Access important community documents, bylaws, guidelines, and meeting minutes.</p>
              <Button variant="default" asChild className="w-full">
                <Link to="/documents">View Documents</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Contact Us */}
          <Card className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-purple-100 p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Contact Management</h3>
              <p className="text-gray-600">Have questions or concerns? Contact our community management team for assistance.</p>
              <Button variant="default" asChild className="w-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
