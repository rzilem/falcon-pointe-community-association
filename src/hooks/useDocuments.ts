
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { toast } from "sonner";

export const useDocuments = () => {
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      console.log("Fetching documents from Supabase");
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('category')
        .order('name');
      
      if (error) {
        console.error("Error fetching documents:", error);
        toast.error("Error loading documents");
        throw error;
      }
      
      console.log("Documents fetched:", data);
      return data || [];
    }
  });

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

  return {
    documents,
    isLoading,
    error,
    refetch,
    handleDelete
  };
};
