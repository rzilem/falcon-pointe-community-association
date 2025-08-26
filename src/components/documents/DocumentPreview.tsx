
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document } from "@/types/document";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // Extract filename from the document name or URL
      const filename = document.name.includes('.') ? document.name : `${document.name}.${document.type}`;
      
      const { data, error } = await supabase
        .storage
        .from('association_documents')
        .createSignedUrl(filename, 3600); // 1 hour expiry

      if (error) {
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
          ) : signedUrl ? (
            <iframe
              src={signedUrl}
              className="w-full h-full border-0"
              title={document.name}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Unable to load preview</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
