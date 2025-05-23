
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ChatbotIntegration = () => {
  return (
    <div className="w-full space-y-6">
      <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto">
        Have questions? Our virtual assistant is here to help 24/7. Use the chat below to get instant answers about our community, amenities, events, and more.
      </p>
      
      <Card className="rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-lg border border-accent/30">
        <CardContent className="p-4">
          <div className="w-full flex justify-center">
            <iframe
              src="https://app.cassidyai.com/embed/chat/v2/cmae9e9cw08ijujx069f8xwib"
              style={{ border: "none" }}
              className="h-[580px] w-full"
              title="Falcon Pointe HOA Assistant"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotIntegration;
