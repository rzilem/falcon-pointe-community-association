import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
  last_updated: string;
}

interface DocumentCategory {
  title: string;
  description: string;
  documents: Document[];
}

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

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

  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case "Association Documents":
        return "Essential governing documents for our community";
      case "Community Guidelines":
        return "Important guidelines and forms for residents";
      case "Financial Documents":
        return "Budget and assessment information";
      default:
        return "";
    }
  };

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
      <div className="bg-gray-800 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Association Documents</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Access important community documents and forms
          </p>
        </div>
      </div>

      <div className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <Card key={index} className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="space-y-2">
                      <CardTitle>{category.title}</CardTitle>
                      <p className="text-gray-600 text-sm md:text-base">{category.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.documents.map((doc, docIndex) => (
                          <div 
                            key={docIndex} 
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                          >
                            <div className="flex items-start md:items-center gap-3">
                              <FileText className="h-5 w-5 text-primary mt-1 md:mt-0" />
                              <div className="space-y-1">
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-600">{doc.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>Last updated: {doc.last_updated}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isMobile && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(doc.url, 'preview')}
                                  className="hidden md:inline-flex"
                                >
                                  Preview
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownload(doc.url)}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Need Assistance?</h2>
            <p className="text-gray-600 mb-8">
              If you need help accessing any documents or have questions about their content,
              please contact the management office.
            </p>
            <Button variant="default" size="lg" asChild>
              <a href="/contact">Contact Management</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
