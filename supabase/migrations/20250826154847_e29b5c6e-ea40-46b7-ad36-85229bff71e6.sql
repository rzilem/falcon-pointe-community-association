-- Update Pool Pavilion images to have correct location
UPDATE site_images 
SET location = 'pool-pavilion'
WHERE description LIKE '%Pool Pavilion%' AND active = true;

-- Update Gathering Room images to have correct location  
UPDATE site_images 
SET location = 'gathering-room'
WHERE description LIKE '%Gathering Room%' AND active = true;