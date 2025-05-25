
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AmenitiesPreview from "@/components/home/AmenitiesPreview";
import CommunityOverview from "@/components/home/CommunityOverview";
import NewsAndEventsPreview from "@/components/home/NewsAndEventsPreview";
import QuickLinks from "@/components/home/QuickLinks";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <CommunityOverview />
      <AmenitiesPreview />
      <NewsAndEventsPreview />
      <QuickLinks />
    </Layout>
  );
};

export default Index;
