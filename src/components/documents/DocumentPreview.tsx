
import React, { useEffect, useState, useRef } from "react";
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
import { Download, Copy, ExternalLink } from "lucide-react";

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview = ({ document, isOpen, onClose }: DocumentPreviewProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && document) {
      generateBlobUrl();
    }
    
    // Cleanup blob URL when component unmounts or dialog closes
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [isOpen, document]);

  const generateBlobUrl = async () => {
    if (!document) return;

    setLoading(true);
    try {
      // Clean up any existing blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      const hasExtension = /\.[a-zA-Z0-9]+$/.test(document.name);
      const fallbackFilename = hasExtension ? document.name : `${document.name}.${document.type}`;
      const key = document.storagePath ?? fallbackFilename;

      console.log('Attempting storage.download for preview:', key);

      const { data, error } = await supabase
        .storage
        .from('association_documents')
        .download(key);

      if (error || !data) {
        console.error('Error downloading file for preview:', error);
        toast.error('Error loading document preview');
        return;
      }

      // Create a blob URL for preview (works around cross-origin restrictions)
      const blobURL = URL.createObjectURL(data);
      blobUrlRef.current = blobURL;
      setBlobUrl(blobURL);
    } catch (error) {
      console.error('Error creating blob preview URL:', error);
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
        .download(key);

      if (error || !data) {
        console.error('Storage download error:', error);
        toast.error('Error downloading document');
        return;
      }

      const blobUrl = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = fallbackFilename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      toast.success('Document download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading document');
    }
  };

  const copyLink = async () => {
    if (!document) return;

    try {
      let urlToCopy = signedUrl;
      if (!urlToCopy) {
        const hasExtension = /\.[a-zA-Z0-9]+$/.test(document.name);
        const fallbackFilename = hasExtension ? document.name : `${document.name}.${document.type}`;
        const key = document.storagePath ?? fallbackFilename;
        const { data, error } = await supabase
          .storage
          .from('association_documents')
          .createSignedUrl(key, 3600);
        if (error || !data) {
          console.error('Error creating signed URL for copy:', error);
          toast.error('Error copying link');
          return;
        }
        urlToCopy = data.signedUrl;
        setSignedUrl(urlToCopy);
      }

      await navigator.clipboard.writeText(urlToCopy);
      toast.success('Document link copied to clipboard');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Error copying link');
    }
  };

  const isPDF = (doc: Document): boolean => {
    return doc.type?.toLowerCase() === 'pdf' || 
           doc.name?.toLowerCase().endsWith('.pdf') ||
           false;
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
          ) : isPDF(document) && blobUrl ? (
            <div className="w-full h-full flex flex-col">
              <object
                data={blobUrl}
                type="application/pdf"
                className="w-full h-full"
                aria-label={`PDF preview of ${document.name}`}
              >
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="text-muted-foreground text-center">
                    <p>PDF preview not supported in this browser</p>
                    <p className="text-sm mt-2">Use the buttons below to view or download</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.open(blobUrl, '_blank')}
                      variant="outline" 
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in New Tab
                    </Button>
                    <Button onClick={downloadDocument} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </object>
            </div>
          ) : !isPDF(document) ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground text-center">
                <p>Preview not supported for {document.type?.toUpperCase()} files</p>
                <p className="text-sm mt-2">Click download to view the document</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadDocument} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download {document.name}
                </Button>
                <Button onClick={copyLink} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground text-center">
                <p>Unable to load preview</p>
                <p className="text-sm mt-2">Try downloading the document instead</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadDocument} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download {document.name}
                </Button>
                <Button onClick={copyLink} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
