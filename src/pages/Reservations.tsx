
import React from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Waves } from "lucide-react";
import ReservationHero from "@/components/reservations/ReservationHero";
import PoolPavilionTab from "@/components/reservations/PoolPavilionTab";
import EventRoomTab from "@/components/reservations/EventRoomTab";

const Reservations = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <ReservationHero />

      {/* Reservations Content with Tabs */}
      <div className="py-6 bg-gray-50">
        <div className="container mx-auto px-2 md:px-4">
          <div className="max-w-full mx-auto">
            <Tabs defaultValue="pool-pavilion" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 max-w-4xl mx-auto">
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
                  <span>Indoor Gathering Room</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pool-pavilion" className="animate-fade-in">
                <PoolPavilionTab />
              </TabsContent>
              
              <TabsContent value="event-room" className="animate-fade-in">
                <EventRoomTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reservations;
