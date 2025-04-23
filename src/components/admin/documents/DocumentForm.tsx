
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";

interface DocumentFormData {
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
}

interface DocumentFormProps {
  initialData?: Document;
  onSubmit: (data: DocumentFormData) => Promise<void>;
  onCancel?: () => void;
}

const DocumentForm = ({ initialData, onSubmit, onCancel }: DocumentFormProps) => {
  const form = useForm<DocumentFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      type: initialData.type,
      url: initialData.url,
      category: initialData.category,
      description: initialData.description || "",
    } : {
      name: "",
      type: "",
      url: "",
      category: "",
      description: "",
    }
  });

  const handleSubmit = async (data: DocumentFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
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
            {initialData ? "Update" : "Add"} Document
          </Button>
          {initialData && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default DocumentForm;
