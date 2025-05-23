
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ContactInfo from "@/components/contact/ContactInfo";
import MapDisplay from "@/components/contact/MapDisplay";
import GravityFormEmbed from "@/components/contact/GravityFormEmbed";
import ChatbotIntegration from "@/components/contact/ChatbotIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, MessageSquareText } from "lucide-react";
import "@/components/contact/ContactTabs.css";
import AnimatedContainer from "@/components/ui/animated-container";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("office");

  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center relative">
          {/* Decorative elements */}
          <div className="decorator-dot decorator-dot-1"></div>
          <div className="decorator-dot decorator-dot-2"></div>
          <div className="decorator-dot decorator-dot-3"></div>
          
          <AnimatedContainer animation="fade" delay="short">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get in touch with our community management team
            </p>
          </AnimatedContainer>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto tabs-container">
            <Tabs 
              defaultValue="office" 
              className="w-full" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 h-auto p-1 w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-sm">
                  <TabsTrigger 
                    value="office" 
                    className="contact-tabs-trigger flex items-center gap-2 py-3 data-[state=active]:bg-white"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Office Information</span>
                    <span className="sm:hidden">Office</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact" 
                    className="contact-tabs-trigger flex items-center gap-2 py-3 data-[state=active]:bg-white"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Contact Form</span>
                    <span className="sm:hidden">Form</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat" 
                    className="contact-tabs-trigger flex items-center gap-2 py-3 data-[state=active]:bg-white"
                  >
                    <MessageSquareText className="h-4 w-4" />
                    <span className="hidden sm:inline">HOA Assistant</span>
                    <span className="sm:hidden">Chat</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="office" className="contact-tabs-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatedContainer animation="fade" delay="medium" className="contact-card">
                    <ContactInfo />
                  </AnimatedContainer>
                  <AnimatedContainer animation="fade" delay="long" className="contact-card map-wrapper">
                    <MapDisplay />
                  </AnimatedContainer>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="contact-tabs-content">
                <div className="max-w-3xl mx-auto">
                  <AnimatedContainer animation="fade" delay="medium">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-center mb-2">Send Us a Message</h2>
                      <p className="text-center text-gray-600 mb-6">
                        Fill out the form below and our team will get back to you as soon as possible
                      </p>
                    </div>
                    <GravityFormEmbed />
                  </AnimatedContainer>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="contact-tabs-content">
                <div className="max-w-3xl mx-auto">
                  <AnimatedContainer animation="fade" delay="medium">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-center mb-2">Falcon Pointe HOA Assistant</h2>
                      <p className="text-center text-gray-600">
                        Get instant answers to frequently asked questions
                      </p>
                    </div>
                    <div className="chat-container">
                      <ChatbotIntegration />
                    </div>
                  </AnimatedContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
