
import React from "react";
import { Card } from "@/components/ui/card";

const ChatbotIntegration = () => {
  return (
    <div className="w-full space-y-4">
      <p className="text-gray-600">
        Have questions? Our virtual assistant is here to help 24/7. Use the chat below to get instant answers about our community, amenities, events, and more.
      </p>
      
      <Card className="rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-md border border-accent/30">
        <div className="w-full flex justify-center p-2">
          <iframe
            src="https://app.cassidyai.com/embed/chat/v2/cmae9e9cw08ijujx069f8xwib"
            style={{ border: "none" }}
            className="h-[500px] w-full max-w-[600px]"
            title="Falcon Pointe HOA Assistant"
          />
        </div>
      </Card>
    </div>
  );
};

export default ChatbotIntegration;
