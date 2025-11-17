-- Make association_documents bucket public to allow document access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'association_documents';