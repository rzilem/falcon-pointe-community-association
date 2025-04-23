
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Document } from "@/types/document";
import { toast } from "sonner";
import DocumentUploader from "@/components/documents/DocumentUploader";
import DocumentForm from "@/components/admin/documents/DocumentForm";
import DocumentList from "@/components/admin/documents/DocumentList";
import { useDocuments } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";

interface DocumentFormData {
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
}

const AdminDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { documents, refetch, handleDelete } = useDocuments();

  const handleSubmit = async (data: DocumentFormData) => {
    try {
      if (selectedDocument) {
        const { error } = await supabase
          .from('documents')
          .update({
            ...data,
            last_updated: new Date().toISOString()
          })
          .eq('id', selectedDocument.id);

        if (error) throw error;
        toast.success("Document updated successfully");
      }

      setSelectedDocument(null);
      refetch();
    } catch (error) {
      toast.error("Error saving document");
      console.error("Error saving document:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Document Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedDocument ? "Edit Document" : "Add New Document"}
            </h2>
            
            {!selectedDocument && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Upload New Document</h3>
                <DocumentUploader 
                  onUploadComplete={refetch}
                  category={selectedDocument?.category || 'Association Documents'}
                />
              </div>
            )}

            <DocumentForm
              initialData={selectedDocument || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedDocument(null)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Documents</h2>
            <DocumentList
              documents={documents}
              onEdit={setSelectedDocument}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDocuments;
