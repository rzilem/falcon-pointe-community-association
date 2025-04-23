
import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import AmenitiesPreview from "@/components/home/AmenitiesPreview";
import CommunityOverview from "@/components/home/CommunityOverview";
import EventsPreview from "@/components/home/EventsPreview";
import QuickLinks from "@/components/home/QuickLinks";
import ImageSlider from "@/components/home/ImageSlider";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <CommunityOverview />
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Community Gallery</h2>
          <ImageSlider />
        </div>
      </section>
      <AmenitiesPreview />
      <EventsPreview />
      <QuickLinks />
    </Layout>
  );
};

export default Index;
