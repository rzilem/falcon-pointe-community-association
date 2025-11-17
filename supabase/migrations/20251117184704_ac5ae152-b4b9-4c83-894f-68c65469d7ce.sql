-- Clean up the two problematic announcements with CSS code
UPDATE site_content 
SET content = 'This email contained HTML formatting that has been removed. The message was from Ricky Zilem, VP of Business Development at PS Property Management Company.' 
WHERE id = '65fad580-8023-4396-b989-7242f9bf105c';

UPDATE site_content 
SET content = 'This email contained HTML formatting that has been removed. This was a forwarded Microsoft webinar invitation about unlocking value after migration with Azure Databricks.' 
WHERE id = 'bfc50fe4-6476-42ce-9e50-939e463d5d3e';

-- Fix the Memorial Day post image with the default announcement banner
UPDATE site_content 
SET featured_image = 'https://ufhcicqixojqpyykjljw.supabase.co/storage/v1/object/public/site-images/wn9uq10y5h.png'
WHERE id = '45e91000-66b9-43c3-afeb-8d728ab1960b';