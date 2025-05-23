
import React from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MapDisplay = () => {
  return (
    <Card className="h-full shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="w-full h-full space-y-4">
          <div className="relative w-full h-[350px] rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.6718492160584!2d-97.5809654!3d30.3473996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cdb6b56d172f%3A0xfbb4880c2f2f85a9!2s19015%20Falcon%20Pointe%20Blvd%2C%20Pflugerville%2C%20TX%2078660!5e0!3m2!1sen!2sus!4v1716487119220!5m2!1sen!2sus"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Falcon Pointe HOA Office Location"
              className="absolute inset-0"
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-base text-muted-foreground bg-white/80 p-3 rounded-lg backdrop-blur-sm shadow-sm">
            <MapPin className="h-5 w-5 text-primary" />
            <p className="font-medium">19015 Falcon Pointe Blvd, Pflugerville, TX 78660</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapDisplay;
