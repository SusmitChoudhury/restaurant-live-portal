// Local generated assets
import sushiImg from '../assets/images/premium_sushi_1781771610958.png';
import soupImg from '../assets/images/premium_soup_1781771622014.png';
import burgerImg from '../assets/images/premium_burger_1781771634417.png';
import pizzaImg from '../assets/images/premium_pizza_1781771645444.png';
import dessertImg from '../assets/images/premium_dessert_1781774458841.png';
import pastaImg from '../assets/images/premium_pasta_1781774471760.png';
import cocktailImg from '../assets/images/premium_cocktail_1781774485171.png';
import appetizerImg from '../assets/images/premium_appetizer_1781774496897.png';
import margheritaImg from '../assets/images/pizza_margherita_1781776425537.png';

// Authentic custom generated high-res food images
import tandooriRotiImg from '../assets/images/tandoori_roti.jpg';
import butterRotiImg from '../assets/images/butter_roti.jpg';
import roomaliRotiImg from '../assets/images/roomali_roti.jpg';
import missiRotiImg from '../assets/images/missi_roti.jpg';
import plainNaanImg from '../assets/images/plain_naan.jpg';
import butterNaanImg from '../assets/images/butter_naan.jpg';
import garlicNaanImg from '../assets/images/garlic_naan.jpg';
import steamedRiceImg from '../assets/images/steamed_basmati_rice.jpg';
import jeeraRiceImg from '../assets/images/jeera_rice.jpg';
import vegPulaoImg from '../assets/images/veg_pulao.jpg';
import peasPulaoImg from '../assets/images/peas_pulao.jpg';
import kashmiriPulaoImg from '../assets/images/kashmiri_pulao.jpg';
import waterBottleImg from '../assets/images/water_bottle.jpg';

const U = (id, w = 600, h = 400) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const DEFAULT_MENU = [
  // ═══════════ STARTERS ═══════════
  { id: 101, name: "Golden Appetizer Platter", category: "Starters", description: "Bruschetta, spring rolls, stuffed mushrooms & shrimp tempura with signature dips.", price: 850, image: appetizerImg, isAvailable: true },
  { id: 102, name: "Crispy Calamari Rings", category: "Starters", description: "Lightly battered squid rings with sriracha aioli and lime wedge.", price: 650, image: U('photo-1599487488170-d11ec9c172f0'), isAvailable: true },
  { id: 103, name: "Truffle Edamame Dumplings", category: "Starters", description: "Steamed dumplings with black truffle, edamame filling, and chili oil.", price: 750, image: U('photo-1496116218417-1a781b1c416c'), isAvailable: true },
  { id: 104, name: "Prawn Tempura", category: "Starters", description: "Tiger prawns in crispy tempura batter with sweet chili dipping sauce.", price: 890, image: U('photo-1615141982883-c7ad0e69fd62'), isAvailable: true },
  { id: 105, name: "Chicken Satay Skewers", category: "Starters", description: "Grilled chicken skewers marinated in turmeric with peanut sauce.", price: 580, image: U('photo-1529692236671-f1f6cf9683ba'), isAvailable: true },
  { id: 106, name: "Bruschetta Trio", category: "Starters", description: "Toasted ciabatta with tomato-basil, mushroom, and olive tapenade.", price: 520, image: U('photo-1572695157366-5e585ab2b69f'), isAvailable: true },
  { id: 107, name: "Cheese Fondue Bites", category: "Starters", description: "Molten gruyère fondue croquettes with truffle honey drizzle.", price: 680, image: U('photo-1541529086526-db283c563270'), isAvailable: true },
  { id: 108, name: "Spicy Tuna Tartare", category: "Starters", description: "Fresh tuna, avocado, sesame, sriracha on crispy wonton chips.", price: 950, image: U('photo-1534604973900-c43ab4c2e0ab'), isAvailable: true },
  { id: 109, name: "Garlic Butter Mushrooms", category: "Starters", description: "Sautéed button mushrooms in herb garlic butter with sourdough.", price: 450, image: U('photo-1504674900247-0877df9cc836'), isAvailable: true },
  { id: 110, name: "Loaded Nachos Supreme", category: "Starters", description: "Tortilla chips with jalapeños, cheddar, guacamole, sour cream.", price: 590, image: U('photo-1513456852971-30c0b8199d4d'), isAvailable: true },

  // ═══════════ SUSHI ═══════════
  { id: 201, name: "Imperial Prawn Tempura Roll", category: "Sushi", description: "Crispy prawn tempura, avocado, topped with truffle oil and gold leaf.", price: 1650, image: sushiImg, isAvailable: true },
  { id: 202, name: "Dragon Rainbow Roll", category: "Sushi", description: "Eel, avocado, crab topped with sashimi rainbow of tuna & salmon.", price: 1450, image: U('photo-1579871494447-9811cf80d66c'), isAvailable: true },
  { id: 203, name: "Tempura Crunch Roll", category: "Sushi", description: "Crispy tempura shrimp roll with spicy mayo and tobiko.", price: 950, image: U('photo-1553621042-f6e147245754'), isAvailable: true },
  { id: 204, name: "Salmon Nigiri (6 pcs)", category: "Sushi", description: "Fresh Norwegian salmon over seasoned sushi rice.", price: 1100, image: U('photo-1583623025817-d180a2221d0a'), isAvailable: true },
  { id: 205, name: "Spicy Tuna Roll", category: "Sushi", description: "Fresh tuna, sriracha mayo, cucumber, sesame seeds.", price: 850, image: U('photo-1617196034796-73dfa7b1fd56'), isAvailable: true },
  { id: 206, name: "California Roll", category: "Sushi", description: "Crab stick, avocado, cucumber, masago — a timeless classic.", price: 750, image: U('photo-1611143669185-af224c5e3252'), isAvailable: true },
  { id: 207, name: "Volcano Roll", category: "Sushi", description: "Baked crab & scallop roll with spicy lava sauce topping.", price: 1250, image: U('photo-1580822184713-fc5400e7fe10'), isAvailable: true },
  { id: 208, name: "Mango Avocado Roll", category: "Sushi", description: "Fresh mango, avocado, cream cheese — light and refreshing.", price: 680, image: U('photo-1559410545-0bdcd187e0a6'), isAvailable: true },

  // ═══════════ MAINS ═══════════
  { id: 301, name: "The Jade Chicken Burger", category: "Mains", description: "Grilled herb chicken patty, aged cheddar, truffle aioli on brioche.", price: 850, image: burgerImg, isAvailable: true },
  { id: 302, name: "Truffle Parmesan Pasta", category: "Mains", description: "Handmade tagliatelle with shaved black truffle and parmesan cream.", price: 1100, image: pastaImg, isAvailable: true },
  { id: 303, name: "Grilled Lamb Chops", category: "Mains", description: "New Zealand lamb rack, rosemary jus, garlic mash, vegetables.", price: 1650, image: U('photo-1544025162-d76694265947'), isAvailable: true },
  { id: 304, name: "Pan-Seared Sea Bass", category: "Mains", description: "Chilean sea bass, lemon caper butter, asparagus, baby potatoes.", price: 1450, image: U('photo-1519708227418-c8fd9a32b7a2'), isAvailable: true },
  { id: 305, name: "Mushroom Risotto", category: "Mains", description: "Creamy arborio with wild mushrooms, parmesan, truffle oil.", price: 950, image: U('photo-1476124369491-e7addf5db371'), isAvailable: true },
  { id: 306, name: "Herb-Crusted Salmon", category: "Mains", description: "Atlantic salmon, herb crust, mashed sweet potato, broccolini.", price: 1380, image: U('photo-1467003909585-2f8a72700288'), isAvailable: true },

  // ═══════════ PIZZA ═══════════
  { id: 401, name: "Classic Margherita", category: "Pizza", description: "Buffalo mozzarella, San Marzano tomatoes, fresh basil.", price: 750, image: margheritaImg, isAvailable: true },
  { id: 402, name: "Chicken Pepperoni", category: "Pizza", description: "Chicken pepperoni, mozzarella, chili flakes on thin crust.", price: 890, image: U('photo-1628840042765-356cda07504e'), isAvailable: true },
  { id: 403, name: "BBQ Chicken Pizza", category: "Pizza", description: "Grilled chicken, BBQ sauce, caramelized onions, cilantro.", price: 950, image: U('photo-1565299624946-b28f40a0ae38'), isAvailable: true },
  { id: 404, name: "Truffle Mushroom Pizza", category: "Pizza", description: "Wild mushroom medley, fontina, truffle oil, arugula.", price: 1350, image: pizzaImg, isAvailable: true },
  { id: 405, name: "Paneer Tikka Pizza", category: "Pizza", description: "Tandoori paneer, green chutney, onion, capsicum — Indo-Italian fusion.", price: 980, image: U('photo-1594007654729-407eedc4be65'), isAvailable: true },

  // ═══════════ SOUPS ═══════════
  { id: 501, name: "Truffle Mushroom Consommé", category: "Soups", description: "Rich wild mushroom soup garnished with microgreens.", price: 550, image: soupImg, isAvailable: true },
  { id: 502, name: "Tom Yum Goong", category: "Soups", description: "Spicy Thai prawn soup with lemongrass, galangal, kaffir lime.", price: 620, image: U('photo-1548943487-a2e4e43b4853'), isAvailable: true },
  { id: 503, name: "French Onion Soup", category: "Soups", description: "Caramelized onions in vegetable broth with gruyère crouton.", price: 480, image: U('photo-1476718406336-bb5a9690ee2a'), isAvailable: true },
  { id: 504, name: "Roasted Tomato Basil", category: "Soups", description: "Fire-roasted tomato soup with fresh basil cream swirl.", price: 420, image: U('photo-1603105037880-880cd4edfb0d'), isAvailable: true },

  // ═══════════ INDIAN CUISINE ═══════════
  { id: 601, name: "Butter Chicken", category: "Indian", description: "Tandoori chicken in rich, creamy tomato-cashew makhani gravy.", price: 650, image: U('photo-1603894584373-5ac82b2ae398'), isAvailable: true },
  { id: 602, name: "Hyderabadi Chicken Biryani", category: "Indian", description: "Saffron basmati, tender chicken, fried onions, whole spices, raita.", price: 650, image: U('photo-1633945274405-b6c8069047b0'), isAvailable: true },
  { id: 603, name: "Paneer Butter Masala", category: "Indian", description: "Soft cottage cheese cubes in rich, creamy tomato-onion gravy.", price: 520, image: U('photo-1631452180519-c014fe946bc7'), isAvailable: true },
  { id: 604, name: "Dal Makhani", category: "Indian", description: "Slow-cooked black lentils with cream and butter — 24hr dal.", price: 420, image: U('photo-1546833999-b9f581a1996d'), isAvailable: true },
  { id: 605, name: "Tandoori Chicken Platter", category: "Indian", description: "Half tandoori chicken, seekh kebab, malai tikka, mint chutney.", price: 890, image: U('photo-1599488615731-7e5c2823ff28'), isAvailable: true },
  { id: 606, name: "Lamb Rogan Josh", category: "Indian", description: "Kashmiri slow-cooked lamb in aromatic saffron-onion gravy.", price: 780, image: U('photo-1585937421612-70a008356fbe'), isAvailable: true },
  { id: 607, name: "Palak Paneer", category: "Indian", description: "Cottage cheese cubes in fresh spinach and spice purée with cream.", price: 480, image: U('photo-1601050690597-df0568f70950'), isAvailable: true },
  { id: 608, name: "Chole Bhature", category: "Indian", description: "Spiced chickpea curry with fluffy deep-fried bread.", price: 380, image: U('photo-1626132647523-66f5bf380027'), isAvailable: true },
  
  // Authentic Breads (Roti & Naan)
  { id: 611, name: "Tandoori Roti", category: "Indian", description: "Whole wheat flatbread baked in a traditional clay oven.", price: 40, image: tandooriRotiImg, isAvailable: true },
  { id: 612, name: "Butter Roti", category: "Indian", description: "Tandoori roti glazed with generous amounts of butter.", price: 50, image: butterRotiImg, isAvailable: true },
  { id: 613, name: "Roomali Roti", category: "Indian", description: "Paper-thin soft flatbread, perfect with rich gravies.", price: 60, image: roomaliRotiImg, isAvailable: true },
  { id: 614, name: "Missi Roti", category: "Indian", description: "Spiced gram flour flatbread with onions and green chilies.", price: 70, image: missiRotiImg, isAvailable: true },
  { id: 615, name: "Plain Naan", category: "Indian", description: "Soft and fluffy refined flour bread cooked in tandoor.", price: 60, image: plainNaanImg, isAvailable: true },
  { id: 616, name: "Butter Naan", category: "Indian", description: "Classic naan brushed with melted butter and sesame seeds.", price: 80, image: butterNaanImg, isAvailable: true },
  { id: 617, name: "Garlic Naan", category: "Indian", description: "Naan topped with minced garlic and fresh coriander.", price: 90, image: garlicNaanImg, isAvailable: true },
  
  // Authentic Rice & Pulao
  { id: 618, name: "Steamed Basmati Rice", category: "Indian", description: "Premium long-grain fragrant basmati rice.", price: 150, image: steamedRiceImg, isAvailable: true },
  { id: 619, name: "Jeera Rice", category: "Indian", description: "Basmati rice tempered with cumin seeds and ghee.", price: 180, image: jeeraRiceImg, isAvailable: true },
  { id: 620, name: "Veg Pulao", category: "Indian", description: "Aromatic basmati rice cooked with mixed vegetables and spices.", price: 220, image: vegPulaoImg, isAvailable: true },
  { id: 621, name: "Peas Pulao", category: "Indian", description: "Fluffy basmati rice tossed with fresh green peas.", price: 200, image: peasPulaoImg, isAvailable: true },
  { id: 622, name: "Kashmiri Pulao", category: "Indian", description: "Sweet and savory rice with dry fruits, nuts, and fresh fruits.", price: 280, image: kashmiriPulaoImg, isAvailable: true },

  // ═══════════ NOODLES ═══════════
  { id: 701, name: "Chicken Ramen", category: "Noodles", description: "Rich chicken broth, tender chicken, soft egg, nori, bean sprouts.", price: 780, image: U('photo-1569718212165-3a8278d5f624'), isAvailable: true },
  { id: 702, name: "Pad Thai Classic", category: "Noodles", description: "Wok-tossed rice noodles, tamarind, peanuts, prawn, lime.", price: 650, image: U('photo-1559314809-0d155014e29e'), isAvailable: true },
  { id: 703, name: "Hakka Noodles", category: "Noodles", description: "Indo-Chinese stir-fried egg noodles with vegetables and soy sauce.", price: 420, image: U('photo-1612929633738-8fe44f7ec841'), isAvailable: true },

  // ═══════════ DESSERTS ═══════════
  { id: 801, name: "Molten Chocolate Lava Cake", category: "Desserts", description: "Rich dark chocolate center, gold dust, berry coulis.", price: 650, image: dessertImg, isAvailable: true },
  { id: 802, name: "Crème Brûlée Royale", category: "Desserts", description: "Vanilla bean custard with caramelized sugar and edible flowers.", price: 550, image: U('photo-1470124182917-cc6e71b22ecc'), isAvailable: true },
  { id: 803, name: "Tiramisu", category: "Desserts", description: "Layers of espresso-soaked ladyfingers, mascarpone cream.", price: 520, image: U('photo-1571877227200-a0d98ea607e9'), isAvailable: true },
  { id: 804, name: "Gulab Jamun (4 pcs)", category: "Desserts", description: "Warm milk-solid balls soaked in rose-cardamom sugar syrup.", price: 350, image: U('photo-1541529086526-db283c563270'), isAvailable: true },
  { id: 805, name: "Rasmalai", category: "Desserts", description: "Soft paneer dumplings in saffron-pistachio milk.", price: 380, image: U('photo-1645177628172-a94c1f96e6db'), isAvailable: true },

  // ═══════════ BEVERAGES ═══════════
  { id: 901, name: "Smoky Rosemary Cocktail", category: "Beverages", description: "Premium gin, rosemary smoke, citrus, elderflower.", price: 750, image: cocktailImg, isAvailable: true },
  { id: 902, name: "Virgin Mojito", category: "Beverages", description: "Fresh lime, mint, soda, sugar — refreshing classic.", price: 220, image: U('photo-1551538827-9c037cb4f32a'), isAvailable: true },
  { id: 903, name: "Fresh Watermelon Juice", category: "Beverages", description: "Cold-pressed watermelon with hint of mint and lime.", price: 280, image: U('photo-1600271886742-f049cd451bba'), isAvailable: true },
  { id: 904, name: "Mango Lassi", category: "Beverages", description: "Thick yogurt smoothie with Alphonso mango and cardamom.", price: 250, image: U('photo-1527661591475-527312dd65f5'), isAvailable: true },
  { id: 913, name: "Mineral Water Bottle (750ml)", category: "Beverages", description: "Naturally chilled pure mineral spring water served with lime & ice.", price: 60, image: waterBottleImg, isAvailable: true },
];

export const CATEGORIES = ['All', 'Starters', 'Sushi', 'Mains', 'Pizza', 'Soups', 'Indian', 'Noodles', 'Desserts', 'Beverages'];
