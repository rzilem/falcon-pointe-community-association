
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview = ({ document, isOpen, onClose }: DocumentPreviewProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      generateSignedUrl();
    }
  }, [isOpen, document]);

  const generateSignedUrl = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      // Prefer exact storage key when available
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(document.name);
      const fallbackFilename = hasExtension ? document.name : `${document.name}.${document.type}`;
      const key = document.storagePath ?? fallbackFilename;
      
      console.log('Attempting to generate signed URL for:', key);
      
      const { data, error } = await supabase
        .storage
        .from('association_documents')
        .createSignedUrl(key, 3600); // 1 hour expiry

      if (error) {
        // If it fails and we haven't tried with .pdf yet, try that as fallback
        if (!document.storagePath && !hasExtension && document.type !== 'pdf') {
          console.log('Retrying with .pdf extension');
          const pdfFilename = `${document.name}.pdf`;
          const { data: pdfData, error: pdfError } = await supabase
            .storage
            .from('association_documents')
            .createSignedUrl(pdfFilename, 3600);
          
          if (!pdfError && pdfData) {
            setSignedUrl(pdfData.signedUrl);
            return;
          }
        }
        
        console.error('Error creating signed URL:', error);
        toast.error('Error loading document preview');
        return;
      }

      setSignedUrl(data.signedUrl);
    } catch (error) {
      console.error('Error creating signed URL:', error);
      toast.error('Error loading document preview');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async () => {
    if (!document) return;
    
    try {
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(document.name);
      const fallbackFilename = hasExtension ? document.name : `${document.name}.${document.type}`;
      const key = document.storagePath ?? fallbackFilename;
      
      const { data, error } = await supabase
        .storage
        .from('association_documents')
        .createSignedUrl(key, 3600);

      if (error) {
        console.error('Error creating signed URL for download:', error);
        toast.error('Error downloading document');
        return;
      }

      window.open(data.signedUrl, '_blank');
      toast.success('Document download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading document');
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading preview...</div>
            </div>
          ) : signedUrl && document.type?.toLowerCase() === 'pdf' ? (
            <iframe
              src={signedUrl}
              className="w-full h-full border-0"
              title={document.name}
            />
          ) : signedUrl && document.type?.toLowerCase() !== 'pdf' ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground text-center">
                <p>Preview not supported for {document.type?.toUpperCase()} files</p>
                <p className="text-sm mt-2">Click download to view the document</p>
              </div>
              <Button onClick={downloadDocument} className="gap-2">
                <Download className="h-4 w-4" />
                Download {document.name}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground text-center">
                <p>Unable to load preview</p>
                <p className="text-sm mt-2">Try downloading the document instead</p>
              </div>
              <Button onClick={downloadDocument} className="gap-2">
                <Download className="h-4 w-4" />
                Download {document.name}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
