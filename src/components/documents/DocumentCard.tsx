
import React, { useState } from "react";
import { FileText, Calendar, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Document } from "@/types/document";
import DocumentPreview from "./DocumentPreview";

interface DocumentCardProps {
  document: Document;
  handleDownload: (url: string) => void;
}

const DocumentCard = ({ document, handleDownload }: DocumentCardProps) => {
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);
  const fileType = document.type ? document.type.toUpperCase() : "";

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.name + '.' + document.type;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      handleDownload(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4">
        <div className="flex items-start md:items-center gap-3">
          <FileText className="h-5 w-5 text-primary mt-1 md:mt-0" />
          <div className="space-y-1">
            <p className="font-medium">{document.name}</p>
            {document.description && (
              <p className="text-sm text-gray-600">{document.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>File type: {fileType}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => downloadFile(document.url)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <DocumentPreview
        document={document}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default DocumentCard;
