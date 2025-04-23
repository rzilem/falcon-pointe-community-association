
import React from "react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentList = ({ documents, onEdit, onDelete }: DocumentListProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-4 border rounded-lg flex items-center justify-between gap-4"
        >
          <div>
            <h3 className="font-medium">{doc.name}</h3>
            <p className="text-sm text-gray-500">{doc.category}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(doc)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(doc.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
