USE foodie_db;

-- 1. DISABLE CHECKS & WIPE EVERYTHING (Resets IDs to 1)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE oder_items; -- (Note: keeping your typo 'oder_items' if that matches your entity)
TRUNCATE TABLE orders;
TRUNCATE TABLE food_items;
TRUNCATE TABLE restaurants;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. INSERT RESTAURANTS (With Verified Unsplash Images)
INSERT INTO restaurants (id, title, description, address, image_url, is_open, created_at) VALUES 
(1, 'Aminia', 'The distinct taste of Kolkata Biryani', 'New Market, Kolkata', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80', 1, NOW()),
(2, 'Peter Cat', 'Home of the famous Chelo Kebab', 'Park Street, Kolkata', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', 1, NOW()),
(3, 'Truffles', 'Best Burgers in Bangalore', 'Koramangala, Bangalore', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 1, NOW()),
(4, 'Meghana Foods', 'Authentic Andhra Style Biryani', 'Indiranagar, Bangalore', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', 1, NOW()),
(5, 'Joey''s Pizza', 'Mumbai''s favorite cheesy pizza', 'Malad West, Mumbai', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80', 1, NOW()),
(6, 'Bademiya', 'Late night kebabs and rolls', 'Colaba, Mumbai', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80', 1, NOW()),
(7, 'Karim''s', 'Historic Mughlai flavors', 'Jama Masjid, Delhi', 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&q=80', 1, NOW()),
(8, 'Big Chill Cafe', 'Italian comfort food', 'Khan Market, Delhi', 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80', 1, NOW()),
(9, 'German Bakery', 'Famous bakery and cafe', 'Koregaon Park, Pune', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', 1, NOW()),
(10, 'Paradise Biryani', 'World famous Hyderabadi Biryani', 'Secunderabad, Hyderabad', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', 1, NOW());

-- 3. INSERT FOOD ITEMS (With Verified Unsplash Images)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
-- Aminia (ID 1)
('Mutton Biryani', 'Signature Kolkata biryani', 350, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800', 1, 1),
('Chicken Chaap', 'Slow cooked marinated chicken', 220, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', 1, 1),
('Firni', 'Traditional clay pot rice pudding', 100, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 1, 1),

-- Peter Cat (ID 2)
('Chelo Kebab', 'Butter rice with grilled kebabs', 450, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800', 1, 2),
('Prawn Cocktail', 'Classic appetizer', 450, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', 1, 2),

-- Truffles (ID 3)
('All American Cheese Burger', 'Juicy patty with double cheese', 290, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 1, 3),
('Ferrero Rocher Shake', 'Thick chocolate shake', 220, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800', 1, 3),

-- Meghana Foods (ID 4)
('Boneless Chicken Biryani', 'Spicy chicken chunks with rice', 310, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 1, 4),

-- Joey's Pizza (ID 5)
('Chicken Tikka Pizza', 'Indian twist to italian pizza', 550, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800', 1, 5),

-- Bademiya (ID 6)
('Chicken Tikka Roll', 'Spicy chargrilled chicken', 250, 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800', 1, 6),
('Mutton Seekh Kebab', 'Minced mutton skewers', 350, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800', 1, 6),

-- Karim's (ID 7)
('Mutton Korma', 'Rich spicy mutton gravy', 400, 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800', 1, 7),

-- Big Chill (ID 8)
('Penne Vodka Pasta', 'Creamy tomato vodka sauce', 550, 'https://images.unsplash.com/photo-1626844131082-256783844137?w=800', 1, 8),
('Mississippi Mud Pie', 'Dense chocolate pie', 350, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 1, 8),

-- German Bakery (ID 9)
('Red Velvet Cake', 'Classic layer cake', 200, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', 1, 9),
('Kheema Pav', 'Spicy minced meat', 280, 'https://images.unsplash.com/photo-1574653853027-270b2a635496?w=800', 1, 9),

-- Paradise (ID 10)
('Hyderabadi Dum Biryani', 'World famous biryani', 400, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 1, 10),
('Double Ka Meetha', 'Traditional dessert', 150, 'https://images.unsplash.com/photo-1593741683466-91674e9e18c8?w=800', 1, 10);

-- 4. INSERT REVIEWS
INSERT INTO reviews (message, rating, created_at, restaurant_id, user_id) VALUES
('Best Biryani in the world!', 5, NOW(), 1, 1),
('Chelo kebab was slightly dry but good.', 4, NOW(), 2, 1),
('Spicy and delicious!', 5, NOW(), 4, 1);