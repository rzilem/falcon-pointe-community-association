
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { toast } from "sonner";

export const useDocuments = () => {
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      console.log("Fetching documents from Supabase Storage");
      
      try {
        // Get files from storage bucket
        const { data: storageFiles, error: storageError } = await supabase
          .storage
          .from('association_documents')
          .list();
        
        if (storageError) {
          console.error("Error fetching storage files:", storageError);
          toast.error("Error loading documents from storage");
          throw storageError;
        }
        
        console.log("Storage files fetched:", storageFiles);
        
        if (!storageFiles || storageFiles.length === 0) {
          console.log("No files found in storage");
          return [];
        }
        
        // Transform storage files to Document format
        const docsFromStorage: Document[] = storageFiles
          .filter(file => !file.id.startsWith('.')) // Filter out hidden files
          .map(file => {
            // Generate a public URL for the file
            const { data } = supabase
              .storage
              .from('association_documents')
              .getPublicUrl(file.name);
            
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
            
            // Determine category based on filename patterns or extensions
            let category = "Association Documents";
            if (file.name.toLowerCase().includes('bylaw') || file.name.toLowerCase().includes('declaration')) {
              category = "Association Documents";
            } else if (file.name.toLowerCase().includes('form') || file.name.toLowerCase().includes('request')) {
              category = "Forms";
            } else if (file.name.toLowerCase().includes('manual') || file.name.toLowerCase().includes('guidelines')) {
              category = "Community Guidelines";
            }
            
            return {
              id: file.id,
              name: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "), // Remove extension and replace underscores with spaces
              type: fileExtension,
              url: data.publicUrl,
              category: category,
              description: "",
              last_updated: file.updated_at || new Date().toISOString()
            };
          });
        
        // Sort documents by category and name
        docsFromStorage.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.name.localeCompare(b.name);
        });
        
        console.log("Transformed documents:", docsFromStorage);
        return docsFromStorage;
      } catch (error) {
        console.error("Error in document fetching process:", error);
        toast.error("Error processing documents");
        throw error;
      }
    }
  });

  const handleDelete = async (id: string) => {
    try {
      // Find the document by id to get its name
      const documentToDelete = documents.find(doc => doc.id === id);
      
      if (!documentToDelete) {
        toast.error("Document not found");
        return;
      }
      
      // Delete the file from storage
      const { error } = await supabase
        .storage
        .from('association_documents')
        .remove([documentToDelete.name]);

      if (error) throw error;
      toast.success("Document deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting document");
      console.error("Error deleting document:", error);
    }
  };

  return {
    documents,
    isLoading,
    error,
    refetch,
    handleDelete
  };
};
