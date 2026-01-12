USE foodie_db;

-- 1. DELETE EXISTING DATA (To avoid duplicates)
DELETE FROM reviews;
DELETE FROM oder_items;
DELETE FROM orders;
DELETE FROM food_items;
DELETE FROM restaurants;

-- 2. INSERT RESTAURANTS (Matching your Home.jsx Cities)
INSERT INTO restaurants (id, title, description, address, image_url, is_open, created_at) VALUES 
-- KOLKATA
(1, 'Aminia', 'The distinct taste of Kolkata Biryani', 'New Market, Kolkata', 'https://b.zmtcdn.com/data/pictures/chains/3/20633/743285743a3d532a873323067db5be63.jpg', 1, NOW()),
(2, 'Peter Cat', 'Home of the famous Chelo Kebab', 'Park Street, Kolkata', 'https://b.zmtcdn.com/data/pictures/2/20452/3b0c29f8bd4952bd33e248b94871e988.jpg', 1, NOW()),

-- BANGALORE
(3, 'Truffles', 'Best Burgers in Bangalore', 'Koramangala, Bangalore', 'https://b.zmtcdn.com/data/pictures/chains/6/50676/9a6886e0df39a37c980302b2e8822003.jpg', 1, NOW()),
(4, 'Meghana Foods', 'Authentic Andhra Style Biryani', 'Indiranagar, Bangalore', 'https://b.zmtcdn.com/data/pictures/chains/4/50674/26d56353d213a77885b3b07044237937.jpg', 1, NOW()),

-- MUMBAI
(5, 'Joey\'s Pizza', 'Mumbai\'s favorite cheesy pizza', 'Malad West, Mumbai', 'https://b.zmtcdn.com/data/pictures/chains/0/36030/33c94970634629672689dfd00b97932c.jpg', 1, NOW()),
(6, 'Bademiya', 'Late night kebabs and rolls', 'Colaba, Mumbai', 'https://b.zmtcdn.com/data/pictures/chains/1/33011/0435a03f4d2096332997323ee3a37331.jpg', 1, NOW()),

-- DELHI
(7, 'Karim\'s', 'Historic Mughlai flavors', 'Jama Masjid, Delhi', 'https://b.zmtcdn.com/data/pictures/chains/1/104/18579a32c2534f3b793679c6da900330.jpg', 1, NOW()),
(8, 'Big Chill Cafe', 'Italian comfort food', 'Khan Market, Delhi', 'https://b.zmtcdn.com/data/pictures/chains/0/1614/360e2060e22709292db87e793933c162.jpg', 1, NOW()),

-- PUNE
(9, 'German Bakery', 'Famous bakery and cafe', 'Koregaon Park, Pune', 'https://b.zmtcdn.com/data/pictures/chains/4/10574/6c4b2e9871542f790295326620577777.jpg', 1, NOW()),

-- HYDERABAD
(10, 'Paradise Biryani', 'World famous Hyderabadi Biryani', 'Secunderabad, Hyderabad', 'https://b.zmtcdn.com/data/pictures/chains/6/90006/7d97539079a08a287a270a64303df243.jpg', 1, NOW());

-- 3. INSERT FOOD ITEMS
INSERT INTO food_items (title, description, price, image_url, is_available, restaurant_id) VALUES
-- Aminia (ID 1)
('Mutton Biryani', 'Signature Kolkata biryani with potato', 350, 'https://b.zmtcdn.com/data/dish_photos/496/8e0c8b4b57657962635332c949361496.jpg', 1, 1),
('Chicken Chaap', 'Slow cooked marinated chicken leg', 220, 'https://b.zmtcdn.com/data/dish_photos/760/972554752e5192233261642273060760.jpg', 1, 1),

-- Peter Cat (ID 2)
('Chelo Kebab', 'Butter rice with grilled kebabs', 450, 'https://b.zmtcdn.com/data/dish_photos/992/37527653549272305367600279262992.jpg', 1, 2),

-- Truffles (ID 3)
('All American Cheese Burger', 'Juicy patty with double cheese', 290, 'https://b.zmtcdn.com/data/dish_photos/279/53235473686862725450256860000279.jpg', 1, 3),

-- Meghana Foods (ID 4)
('Boneless Chicken Biryani', 'Spicy chicken chunks with aromatic rice', 310, 'https://b.zmtcdn.com/data/dish_photos/d20/e0339d8494b9df544604e57973024d20.jpg', 1, 4),

-- Joey's Pizza (ID 5)
('Chicken Tikka Pizza', 'Indian twist to italian pizza', 550, 'https://b.zmtcdn.com/data/dish_photos/08f/0859560f76902264903332007077f08f.jpg', 1, 5),

-- Karim's (ID 7)
('Mutton Korma', 'Rich spicy mutton gravy', 400, 'https://b.zmtcdn.com/data/dish_photos/3b9/8b2339003403247072607147773233b9.jpg', 1, 7);

-- 4. INSERT REVIEWS
INSERT INTO reviews (message, rating, created_at, restaurant_id, user_id) VALUES
('Best Biryani in the world!', 5, NOW(), 1, 1),
('Chelo kebab was slightly dry but good.', 4, NOW(), 2, 1),
('Spicy and delicious!', 5, NOW(), 4, 1);