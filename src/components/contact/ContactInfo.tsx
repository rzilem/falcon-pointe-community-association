
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
            <p className="text-gray-600">410 Cool Spring Way</p>
            <p className="text-gray-600">Austin, TX 78737</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-gray-600">
              <a href="tel:5128294739">(512) 829-4739</a>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-600">
              <a href="mailto:highpointe@psprop.net">
                highpointe@psprop.net
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 mt-1 text-primary" />
          <div>
            <h3 className="font-semibold">Office Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-gray-600">Saturday - Sunday: Closed</p>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-lg">
              <h4 className="font-semibold text-accent">Virtual Assistant Phyllis</h4>
              <p className="text-sm text-gray-600 mt-1">
                Text your community's virtual AI assistant Phyllis for answers to your community questions 24-7 all via text. No app or software needed.
              </p>
              <p className="font-medium text-primary mt-2">
                Text: <a href="sms:5123994616" className="underline">(512) 399-4616</a>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
