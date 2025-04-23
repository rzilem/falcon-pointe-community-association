
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Document, DocumentCategoryType } from "@/types/document";
import { getCategoryDescription } from "@/utils/documents";
import Hero from "@/components/documents/Hero";
import DocumentSearch from "@/components/documents/DocumentSearch";
import DocumentCategoryComponent from "@/components/documents/DocumentCategory";
import ContactSection from "@/components/documents/ContactSection";
import { toast } from "sonner";
import { useDocuments } from "@/hooks/useDocuments";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { documents, isLoading, error } = useDocuments();

  const handleDownload = async (url: string) => {
    try {
      window.open(url, '_blank');
      toast.success("Document download started");
    } catch (error) {
      toast.error("Error downloading document");
      console.error("Download error:", error);
    }
  };

  const documentCategories: DocumentCategoryType[] = documents.reduce((acc: DocumentCategoryType[], doc: Document) => {
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

  if (error) {
    console.error("Error in documents page:", error);
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 mb-2">Error loading documents</p>
          <p className="text-sm text-gray-600">Please try again later</p>
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

            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredCategories.map((category, index) => (
                  <DocumentCategoryComponent
                    key={index}
                    title={category.title}
                    description={category.description}
                    documents={category.documents}
                    handleDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {documents.length > 0 ? (
                  <p className="text-gray-500">No documents found matching your search.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-500">No documents available yet.</p>
                    <p className="text-sm text-gray-400">Documents will appear here once they are added to the system.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactSection />
    </Layout>
  );
};

export default Documents;
