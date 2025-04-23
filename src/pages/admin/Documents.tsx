import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DocumentUploader from "@/components/documents/DocumentUploader";

interface DocumentForm {
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
}

const AdminDocuments = () => {
  const form = useForm<DocumentForm>();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const { data: documents = [], refetch } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('category')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = async (data: DocumentForm) => {
    try {
      if (selectedDocument) {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            ...data,
            last_updated: new Date().toISOString()
          })
          .eq('id', selectedDocument.id);

        if (error) throw error;
        toast.success("Document updated successfully");
      } else {
        // Create new document metadata (actual file upload handled by DocumentUploader)
        const { error } = await supabase
          .from('documents')
          .insert([{
            ...data,
            last_updated: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success("Document created successfully");
      }

      form.reset();
      setSelectedDocument(null);
      refetch();
    } catch (error) {
      toast.error("Error saving document");
      console.error("Error saving document:", error);
    }
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    form.reset({
      name: doc.name,
      type: doc.type,
      url: doc.url,
      category: doc.category,
      description: doc.description || ""
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Document deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting document");
      console.error("Error deleting document:", error);
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
                  category={form.watch('category') || 'Association Documents'}
                />
              </div>
            )}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PDF" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button type="submit">
                  {selectedDocument ? "Update" : "Add"} Document
                </Button>
                {selectedDocument && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedDocument(null);
                      form.reset({
                        name: "",
                        type: "",
                        url: "",
                        category: "",
                        description: "",
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Documents</h2>
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
                      onClick={() => handleEdit(doc)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDocuments;
