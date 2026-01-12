USE foodie_db;

-- 1. Bademiya, Mumbai (ID 6)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
('Chicken Tikka Roll', 'Spicy chargrilled chicken wrapped in rumali roti', 250, 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800', 1, 6),
('Mutton Seekh Kebab', 'Minced mutton skewers grilled to perfection', 350, 'https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?w=800', 1, 6);

-- 2. Big Chill Cafe, Delhi (ID 8)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
('Penne Vodka Pasta', 'Creamy tomato vodka sauce with parmesan', 550, 'https://images.unsplash.com/photo-1626844131082-256783844137?w=800', 1, 8),
('Mississippi Mud Pie', 'Dense chocolate pie with fudge sauce', 350, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 1, 8);

-- 3. German Bakery, Pune (ID 9)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
('Red Velvet Cake', 'Classic layer cake with cream cheese frosting', 200, 'https://images.unsplash.com/photo-1586788680434-30d32443f858?w=800', 1, 9),
('Kheema Pav', 'Spicy minced meat served with buttery bread', 280, 'https://images.unsplash.com/photo-1574653853027-270b2a635496?w=800', 1, 9);

-- 4. Paradise Biryani, Hyderabad (ID 10)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
('Hyderabadi Dum Biryani', 'World famous biryani with mirchi ka salan', 400, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 1, 10),
('Double Ka Meetha', 'Traditional Hyderabadi bread pudding dessert', 150, 'https://images.unsplash.com/photo-1593741683466-91674e9e18c8?w=800', 1, 10);

-- 5. Add EXTRA items to existing ones (To make the menu look full)
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
('Firni', 'Traditional clay pot rice pudding', 100, 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=800', 1, 1), -- Aminia
('Prawn Cocktail', 'Classic appetizer with thousand island sauce', 450, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', 1, 2), -- Peter Cat
('Ferrero Rocher Shake', 'Thick chocolate shake topped with nuts', 220, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800', 1, 3); -- Truffles