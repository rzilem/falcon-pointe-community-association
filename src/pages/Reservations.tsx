
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentDisplay from "@/components/cms/ContentDisplay";
import GravityFormsMonitor from "@/components/reservations/GravityFormsMonitor";
import DebugPanel from "@/components/reservations/DebugPanel";
import { Building2, Waves } from "lucide-react";
import ReservationHero from "@/components/reservations/ReservationHero";
import PoolPavilionTab from "@/components/reservations/PoolPavilionTab";
import EventRoomTab from "@/components/reservations/EventRoomTab";
import ReservationStyles from "@/components/reservations/ReservationStyles";

const Reservations = () => {
  // Track active tab for monitoring
  const [activeTab, setActiveTab] = useState<string>("pool-pavilion");

  // Force iframe reload when tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const iframes = document.querySelectorAll('iframe[src*="gfembed"]');
      iframes.forEach((iframe) => {
        const htmlIframe = iframe as HTMLIFrameElement;
        const currentSrc = htmlIframe.src;
        htmlIframe.src = 'about:blank';
        setTimeout(() => {
          htmlIframe.src = currentSrc;
        }, 100);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    console.log('Tab changing to:', value);
    setActiveTab(value);
  };

  return (
    <Layout>
      {/* Replace CalendlyScript with GravityFormsMonitor */}
      <GravityFormsMonitor activeTab={activeTab} />
      
      {/* Enhanced Hero Section */}
      <ReservationHero />

      {/* Reservations Content with Enhanced Tabs */}
      <div className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs 
              defaultValue="pool-pavilion" 
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="pool-pavilion" 
                  className="text-xl font-semibold py-4 flex gap-2 items-center transition-all duration-200 hover:bg-primary/10"
                >
                  <Waves className="h-5 w-5" /> 
                  <span>Pool Pavilion</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="event-room" 
                  className="text-xl font-semibold py-4 flex gap-2 items-center transition-all duration-200 hover:bg-primary/10"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Indoor Event Room</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pool-pavilion" className="calendly-tab-content animate-fade-in">
                <PoolPavilionTab />
              </TabsContent>
              
              <TabsContent value="event-room" className="calendly-tab-content animate-fade-in">
                <EventRoomTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add custom styles to ensure proper display */}
      <ReservationStyles />
      
      {/* Debug panel for development */}
      <DebugPanel />
    </Layout>
  );
};

export default Reservations;
