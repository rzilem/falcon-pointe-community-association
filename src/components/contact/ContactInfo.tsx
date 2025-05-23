
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail, Building2 } from "lucide-react";

const ContactInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Office Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Address</h3>
            <p className="text-gray-600">19015 Falcon Pointe Blvd</p>
            <p className="text-gray-600">Pflugerville, TX 78660</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-gray-600">(512) 670-1400</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-600">info@falconpointehoa.com</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Office Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:30 PM</p>
            <p className="text-gray-600">Saturday - Sunday: Closed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
