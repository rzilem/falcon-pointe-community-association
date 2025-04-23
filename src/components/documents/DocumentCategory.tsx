
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentCard from "./DocumentCard";
import { Document } from "@/types/document";

interface DocumentCategoryProps {
  title: string;
  description: string;
  documents: Document[];
  handleDownload: (url: string) => void;
}

const DocumentCategory = ({ 
  title, 
  description, 
  documents, 
  handleDownload 
}: DocumentCategoryProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle>{title}</CardTitle>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <DocumentCard 
              key={index} 
              document={doc} 
              handleDownload={handleDownload}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCategory;
