
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText } from "lucide-react";

interface DocumentUploaderProps {
  onUploadComplete: () => void;
  category: string;
}

const DocumentUploader = ({ onUploadComplete, category }: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('association_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('association_documents')
        .getPublicUrl(filePath);

      // Add document to the documents table
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          type: fileExt || 'unknown',
          url: publicUrl,
          category: category,
          description: '',
        });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      onUploadComplete();
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <FileText className="h-5 w-5 text-gray-400" />
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="flex-1"
      />
      <Button 
        onClick={handleFileUpload} 
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default DocumentUploader;
