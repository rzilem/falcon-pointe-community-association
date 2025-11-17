-- Add AI image generation control field to site_content table
ALTER TABLE site_content 
ADD COLUMN IF NOT EXISTS use_ai_image_generation BOOLEAN DEFAULT true;

COMMENT ON COLUMN site_content.use_ai_image_generation IS 
'Controls whether AI should generate images for this post. Default true.';