USE foodie_db;

-- =========================================
-- 1. FIX RESTAURANT IMAGES (Reliable Unsplash Links)
-- =========================================

-- Aminia (Biryani/Indian)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80' WHERE id = 1;

-- Peter Cat (Grill/Kebab)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' WHERE id = 2;

-- Truffles (Burger)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' WHERE id = 3;

-- Meghana Foods (Biryani)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' WHERE id = 4;

-- Joey's Pizza (Pizza)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80' WHERE id = 5;

-- Bademiya (Kebab/Rolls)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80' WHERE id = 6;

-- Karim's (Curry/Mughlai)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&q=80' WHERE id = 7;

-- Big Chill (Italian/Pasta)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80' WHERE id = 8;

-- German Bakery (Cake)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80' WHERE id = 9;

-- Paradise (Biryani)
UPDATE restaurants SET image_url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' WHERE id = 10;


-- =========================================
-- 2. FIX FOOD ITEM IMAGES (Grouped by Type)
-- =========================================

-- Fix Biryani Items
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80' WHERE title LIKE '%Biryani%';

-- Fix Chicken Items (Curry style)
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80' WHERE title LIKE '%Chicken%' AND title NOT LIKE '%Biryani%';

-- Fix Kebabs
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80' WHERE title LIKE '%Kebab%' OR title LIKE '%Seekh%';

-- Fix Burgers
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' WHERE title LIKE '%Burger%';

-- Fix Pizza
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80' WHERE title LIKE '%Pizza%';

-- Fix Pasta
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1626844131082-256783844137?w=800&q=80' WHERE title LIKE '%Pasta%';

-- Fix Cakes/Desserts
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' WHERE title LIKE '%Cake%' OR title LIKE '%Pie%' OR title LIKE '%Meetha%';

-- Fix Rolls
UPDATE food_items SET image_url = 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&q=80' WHERE title LIKE '%Roll%' OR title LIKE '%Pav%';