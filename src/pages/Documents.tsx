
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Documents = () => {
  const documentCategories = [
    {
      title: "Association Documents",
      description: "Essential governing documents for our community",
      documents: [
        { 
          name: "Articles of Incorporation", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213315/Articles_of_Incorporation.pdf"
        },
        { 
          name: "Bylaws", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213316/Bylaws.pdf"
        },
        { 
          name: "CCRs", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213317/CCRs.pdf"
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
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213318/ACC_Guidelines.pdf"
        },
        { 
          name: "Gate Access Form", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213319/Gate_Access_Form.pdf"
        },
        { 
          name: "Pool Rules", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213320/Pool_Rules.pdf"
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
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213321/2024_Budget.pdf"
        },
        { 
          name: "Assessment Information", 
          type: "PDF",
          url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213322/Assessment_Information.pdf"
        }
      ]
    }
  ];

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Association Documents</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Access important community documents and forms
          </p>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {documentCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <p className="text-gray-600">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.documents.map((doc, docIndex) => (
                        <div key={docIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(doc.url)}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
