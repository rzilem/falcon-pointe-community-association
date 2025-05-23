
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { FileText } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentList = ({ documents, onEdit, onDelete }: DocumentListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      setDocumentToDelete(null);
    }
  };

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
              <p className="text-sm text-gray-500">{doc.category || "Uncategorized"}</p>
              {doc.description && (
                <p className="text-xs text-gray-400 mt-1">{doc.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {doc.type ? doc.type.toUpperCase() : "Unknown type"}
              </p>
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
              onClick={() => handleDeleteClick(doc.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="delete"
      />
    </div>
  );
};

export default DocumentList;
