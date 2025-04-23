
import React from "react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { FileText } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentList = ({ documents, onEdit, onDelete }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <p className="text-gray-500 mb-2">No documents found</p>
        <p className="text-sm text-gray-400">Add your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-4 border rounded-lg flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.category}</p>
              {doc.description && (
                <p className="text-xs text-gray-400 mt-1">{doc.description}</p>
              )}
            </div>
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
