
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory } from "@/types/document";
import { getCategoryDescription } from "@/utils/documents";
import Hero from "@/components/documents/Hero";
import DocumentSearch from "@/components/documents/DocumentSearch";
import DocumentCategory from "@/components/documents/DocumentCategory";
import ContactSection from "@/components/documents/ContactSection";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('category')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const documentCategories: DocumentCategory[] = documents.reduce((acc: DocumentCategory[], doc: Document) => {
    const existingCategory = acc.find(cat => cat.title === doc.category);
    if (existingCategory) {
      existingCategory.documents.push(doc);
    } else {
      acc.push({
        title: doc.category,
        description: getCategoryDescription(doc.category),
        documents: [doc]
      });
    }
    return acc;
  }, []);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredCategories = documentCategories
    .map(category => ({
      ...category,
      documents: category.documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.documents.length > 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading documents...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero />
      
      <div className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <DocumentSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="grid grid-cols-1 gap-6">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <DocumentCategory
                    key={index}
                    title={category.title}
                    description={category.description}
                    documents={category.documents}
                    handleDownload={handleDownload}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No documents found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ContactSection />
    </Layout>
  );
};

export default Documents;
