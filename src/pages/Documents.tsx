
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Documents = () => {
  const documentCategories = [
    {
      title: "Governing Documents",
      description: "Essential documents that outline community rules and regulations",
      documents: [
        { name: "CC&Rs", type: "PDF" },
        { name: "Bylaws", type: "PDF" },
        { name: "Articles of Incorporation", type: "PDF" }
      ]
    },
    {
      title: "Architectural Guidelines",
      description: "Information about home modifications and improvements",
      documents: [
        { name: "Modification Request Form", type: "PDF" },
        { name: "Paint Color Guidelines", type: "PDF" },
        { name: "Landscaping Guidelines", type: "PDF" }
      ]
    },
    {
      title: "Financial Documents",
      description: "Budget and financial reporting documents",
      documents: [
        { name: "Annual Budget", type: "PDF" },
        { name: "Financial Statements", type: "PDF" },
        { name: "Reserve Study", type: "PDF" }
      ]
    }
  ];

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
                        <div key={docIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                          <Button variant="outline" size="sm">
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
