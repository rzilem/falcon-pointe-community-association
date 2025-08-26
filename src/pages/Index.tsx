
import React from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import Hero from "@/components/home/Hero";
import AmenitiesPreview from "@/components/home/AmenitiesPreview";
import CommunityOverview from "@/components/home/CommunityOverview";
import NewsAndEventsPreview from "@/components/home/NewsAndEventsPreview";
import QuickLinks from "@/components/home/QuickLinks";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Home"
        description="Welcome to Falcon Pointe Community Association - A premier master-planned community in Pflugerville, Texas offering exceptional amenities, family-friendly atmosphere, and quality living for nearly 1,624 families."
        keywords="Falcon Pointe, Pflugerville, Texas community, homeowners association, amenities, family living, master-planned community"
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
