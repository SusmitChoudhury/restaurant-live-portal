# Technical Specification & White-Labeling Implementation Guide
## Aura Royale Smart Dining & Kitchen Management Portal

This technical guide provides step-by-step instructions for software agencies, freelance developers, and technical leads to white-label, customize, and deploy this codebase for any client restaurant, cafe, or hospitality brand.

---

### 1. Technology Stack Specifications

| Layer | Technologies Used | Key Libraries & Dependencies |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 (Vite Bundler) | React, Lucide Icons, Web Audio API, Native BroadcastChannel |
| **Styling** | Vanilla CSS3 (Design Tokens) | CSS Custom Properties, Glassmorphism, CSS Grid, Media Queries |
| **State Management**| React Context API | `CartContext.jsx` (Cart, Billing, Tables), `SocketContext.jsx` (Live Engine, Inventory) |
| **Local Tab Sync** | HTML5 BroadcastChannel API | Zero network overhead, works seamlessly on static hosting |
| **Cloud Networking**| WebSocket & REST | `socket.io` / `socket.io-client`, Express, CORS, HTTP REST |
| **Backend Runtime** | Node.js (v18+) | Express, Socket.IO, `fs` (Atomic JSON Storage) |
| **Hosting Support** | Cloud Agnostic | Frontend: Netlify, Vercel, Cloudflare Pages<br>Backend: Railway, Render, Fly.io, DigitalOcean, AWS |

---

### 2. White-Labeling & Brand Customization

#### 2.1 Changing Brand Name & Typography
- Open `client/src/components/Navbar.jsx` and `client/src/components/Hero.jsx`.
- Locate the brand heading:
  ```jsx
  // Change "AURA & ROYALE" to the client's restaurant name:
  <a href="#hero" className="navbar__brand">
    THE BRASSERIE <span className="navbar__brand-amp">&</span> LOUNGE
  </a>
  ```
- To change fonts, update the Google Font imports in `client/index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  ```

#### 2.2 Updating Color Palette & Design Tokens
All visual tokens are defined centrally in `client/src/index.css`. Modify these variables to change the aesthetic theme across the entire application:
```css
:root {
  /* Brand Primary Colors */
  --color-primary: #0f221a;        /* Base dark emerald */
  --color-primary-light: #19382c;  /* Card surface hover */
  --color-primary-dark: #080c0a;   /* App background */

  /* Luxury Accent Colors */
  --color-accent: #d4af37;        /* Gold metallic accent */
  --color-accent-dim: rgba(212, 175, 55, 0.12); /* Subtle glow */

  /* Status Colors */
  --color-danger: #ef4444;        /* Out of Stock & Cancelled */
  --color-success: #10b981;       /* Served & Live Connected */
  --color-warning: #f59e0b;       /* Pending Order Alert */
}
```

---

### 3. Customizing the Menu & Categories

#### 3.1 Editing Menu Dishes
All default menu items reside in `client/src/data/defaultMenu.js` (and mirrored in `server/data/menu.json`).

To add or modify dishes:
```javascript
export const DEFAULT_MENU = [
  {
    id: 1, // Unique numeric or string ID
    name: "Truffle Infused Wild Mushroom Soup",
    category: "Soups & Shorba",
    price: 340, // Price in client's local currency
    description: "Cream of forest wild mushrooms drizzled with white truffle oil and fresh micro-greens.",
    image: "https://your-cdn.com/images/mushroom-soup.jpg",
    isAvailable: true // Default stock availability
  },
  // Add additional dishes here...
];
```

#### 3.2 Modifying Categories
Categories are controlled by the `CATEGORIES` array in `client/src/data/defaultMenu.js`:
```javascript
export const CATEGORIES = [
  'All',
  'Soups & Shorba',
  'Starters & Tandoor',
  'Main Course - Gravies & Curries',
  'Biryani & Basmati Rice',
  'Artisan Tandoori Breads',
  'Desserts & Mithai',
  'Beverages & Coolers'
];
```
Adding or changing names here automatically updates the sticky category tabs and dish counter pills.

#### 3.3 Customizing Add-On Extras
Upsell items are defined in `client/src/context/CartContext.jsx`:
```javascript
export const EXTRAS_LIST = [
  { id: 'ex-cheese', name: 'Artisanal Extra Cheese', price: 60 },
  { id: 'ex-truffle', name: 'White Truffle Oil Drizzle', price: 120 },
  { id: 'ex-butter', name: 'Cultured Garlic Butter', price: 40 },
  { id: 'ex-chutney', name: 'Mint & Raw Mango Dip', price: 30 },
];
```

---

### 4. Customizing Taxes & Table Layout

#### 4.1 Adjusting GST and Service Charge
Open `client/src/context/CartContext.jsx`:
```javascript
// Change tax rates to match local jurisdiction:
const gst = Math.round((itemsSubtotal + extrasSubtotal) * 0.05);          // 5% GST
const serviceCharge = Math.round((itemsSubtotal + extrasSubtotal) * 0.03); // 3% Service Charge
```

#### 4.2 Adjusting Table Numbers and Seat Capacities
Open `client/src/components/TableSelector.jsx`:
```javascript
const tables = [
  { id: 1, seats: 2, occupied: false },
  { id: 2, seats: 2, occupied: false },
  { id: 3, seats: 4, occupied: false },
  { id: 4, seats: 4, occupied: false },
  { id: 5, seats: 6, occupied: false },
  // Add as many tables as the client's floor plan requires
];
```

---

### 5. Deployment Instructions

#### 5.1 Static Frontend Deployment (Netlify / Vercel)
The client frontend can be hosted for free or low cost on any static cloud platform.
1. `cd client`
2. `npm install`
3. `npm run build`
4. Deploy the generated `dist/` directory.
5. In your platform dashboard, add an environment variable pointing to the backend:
   ```
   VITE_BACKEND_URL=https://your-backend-server.railway.app
   ```

#### 5.2 Backend Server Deployment (Railway / Render / VPS)
1. `cd server`
2. `npm install`
3. Set environment variable: `PORT=5001` (or your host's `$PORT`).
4. Start command: `node server.js`
5. The backend automatically creates `server/data/menu.json` and `server/data/orders.json` for persistence.

---

### 6. Local Development Quickstart

```bash
# Terminal 1: Start Client Frontend (Vite)
cd restaurant-live-portal/client
npm install
npm run dev
# Running on http://localhost:5174

# Terminal 2: Start Backend Server (Express + Socket.IO)
cd restaurant-live-portal/server
npm install
npm start
# Running on http://localhost:5001
```
