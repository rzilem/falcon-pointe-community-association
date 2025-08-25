
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AmenitiesPreview from "@/components/home/AmenitiesPreview";
import CommunityOverview from "@/components/home/CommunityOverview";
import NewsAndEventsPreview from "@/components/home/NewsAndEventsPreview";
import QuickLinks from "@/components/home/QuickLinks";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Welcome Home"
        description="Highpointe POA is a gated master-planned community in the beautiful Hill Country of Southwest Austin, TX. Discover our stunning homes and top-notch amenities."
        keywords="Highpointe POA, Dripping Springs, Hill Country, gated community, master-planned community, Austin TX, amenities"
      />
      <Hero />
      <CommunityOverview />
      <AmenitiesPreview />
      <NewsAndEventsPreview />
      <QuickLinks />
    </Layout>
  );
};

export default Index;
