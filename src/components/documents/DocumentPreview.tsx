
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document } from "@/types/document";

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview = ({ document, isOpen, onClose }: DocumentPreviewProps) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[70vh]">
          <iframe
            src={document.url}
            className="w-full h-full border-0"
            title={document.name}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
