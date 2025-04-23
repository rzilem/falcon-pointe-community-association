import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface Document {
  name: string;
  type: string;
  url: string;
  lastUpdated: string;
  description: string;
}

interface DocumentCategory {
  title: string;
  description: string;
  documents: Document[];
}

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  const documentCategories: DocumentCategory[] = [
    {
      title: "Association Documents",
      description: "Essential governing documents for our community",
      documents: [
        { 
          name: "Articles of Incorporation", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213315/Articles_of_Incorporation.pdf",
          lastUpdated: "2024-01-15",
          description: "Legal document establishing the association as a corporation"
        },
        { 
          name: "Bylaws", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213316/Bylaws.pdf",
          lastUpdated: "2024-02-01",
          description: "Rules governing the operation of the association"
        },
        { 
          name: "CCRs", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213317/CCRs.pdf",
          lastUpdated: "2024-02-15",
          description: "Covenants, conditions, and restrictions for the community"
        }
      ]
    },
    {
      title: "Community Guidelines",
      description: "Important guidelines and forms for residents",
      documents: [
        { 
          name: "ACC Guidelines", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213318/ACC_Guidelines.pdf",
          lastUpdated: "2024-03-10",
          description: "Architectural Control Committee guidelines for home modifications"
        },
        { 
          name: "Gate Access Form", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213319/Gate_Access_Form.pdf",
          lastUpdated: "2024-03-15",
          description: "Form to request gate access for visitors and service providers"
        },
        { 
          name: "Pool Rules", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213320/Pool_Rules.pdf",
          lastUpdated: "2024-03-20",
          description: "Rules and regulations for community pool usage"
        }
      ]
    },
    {
      title: "Financial Documents",
      description: "Budget and assessment information",
      documents: [
        { 
          name: "2024 Budget", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213321/2024_Budget.pdf",
          lastUpdated: "2024-01-05",
          description: "Annual budget for the current fiscal year"
        },
        { 
          name: "Assessment Information", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213322/Assessment_Information.pdf",
          lastUpdated: "2024-01-10",
          description: "Information about HOA dues and payment schedules"
        }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredCategories = documentCategories.map(category => ({
    ...category,
    documents: category.documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.documents.length > 0);

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
                                  <span>Last updated: {doc.lastUpdated}</span>
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
