
import React from "react";
import { FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Document } from "@/types/document";

interface DocumentCardProps {
  document: Document;
  handleDownload: (url: string) => void;
}

const DocumentCard = ({ document, handleDownload }: DocumentCardProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
      <div className="flex items-start md:items-center gap-3">
        <FileText className="h-5 w-5 text-primary mt-1 md:mt-0" />
        <div className="space-y-1">
          <p className="font-medium">{document.name}</p>
          <p className="text-sm text-gray-600">{document.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Last updated: {document.last_updated}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(document.url, 'preview')}
            className="hidden md:inline-flex"
          >
            Preview
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleDownload(document.url)}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default DocumentCard;
