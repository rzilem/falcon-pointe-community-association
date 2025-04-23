
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AmenitiesPreview from "@/components/home/AmenitiesPreview";
import CommunityOverview from "@/components/home/CommunityOverview";
import EventsPreview from "@/components/home/EventsPreview";
import QuickLinks from "@/components/home/QuickLinks";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <CommunityOverview />
      <AmenitiesPreview />
      <EventsPreview />
      <QuickLinks />
    </Layout>
  );
};

export default Index;
