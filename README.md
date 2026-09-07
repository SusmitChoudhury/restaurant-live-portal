# 🍽️ Aura Royale Bistro — Full-Stack Restaurant System with Real-Time Kitchen Portal

A complete, full-stack restaurant ordering and kitchen management platform featuring:
- **Customer Dining Menu**: High-resolution dish photography, table selector, cart drawer with special instructions, and live order tracking.
- **Real-Time Admin Kitchen Portal**: Live order stream with table numbers, audio chime alerts on incoming orders, status dispatching (`Pending` ➔ `Cooking` ➔ `Served`), and daily sales analytics.
- **Instant Out-of-Stock Controller**: Admin can toggle any dish "In Stock" or "Out of Stock" with 1-click; all connected customer devices instantly disable that item in real time without refreshing.
- **Real-Time Backend**: Built with Node.js, Express, and Socket.IO with zero-configuration persistent JSON database (`data/orders.json`, `data/menu.json`).

---

## 📁 Project Structure

```
restaurant-live-portal/
├── server/
│   ├── data/
│   │   ├── menu.json         # Persistent menu items and stock availability
│   │   └── orders.json       # Persistent table orders and history
│   ├── package.json          # Express, Socket.IO, CORS
│   └── server.js             # Real-time WebSocket + REST API server (Port 5001)
├── client/
│   ├── public/
│   │   └── _redirects        # Netlify SPA routing rules
│   ├── src/
│   │   ├── assets/images/    # High-resolution food photography
│   │   ├── components/       # UI components (Menu, Cart, TableSelector, OrderTracker)
│   │   ├── components/admin/ # Admin dashboard, stock manager, order cards, analytics
│   │   ├── context/          # SocketContext (real-time listeners & Web Audio chime)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json          # React, Vite, Socket.IO-Client
│   └── vite.config.js
├── package.json              # Convenient root runner scripts
└── README.md
```

---

## 💻 Running Locally (Step-by-Step)

### Option 1: Run Both in Two Terminals (Recommended)

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm start
```
*Server will start at: `http://localhost:5001`*

#### Terminal 2 — Start the Frontend:
```bash
cd client
npm run dev
```
*Frontend will open at: `http://localhost:5174`*

---

## 🧪 How to Test Real-Time Synchronization in Action

1. Open **`http://localhost:5174`** in your browser.
2. In the top right navigation, switch between:
   - **🍽️ Customer Menu**: Select your Table # (e.g., Table 4), add items to the cart, and click **Place Order**.
   - **⚡ Admin Portal**: Notice the order card appears instantly with a bell chime! Click **"Start Preparing"** or **"Mark as Served"**.
3. **Test the Out-of-Stock feature**:
   - In the Admin Portal, find *"Artisanal Woodfired Margherita"* and click **"In Stock"** to switch it to **"Out of Stock"**.
   - Switch back to the Customer Menu tab: notice the Margherita card immediately turns grey with an **"OUT OF STOCK"** badge, and the ordering button is locked!

---

## 🌐 Step-by-Step Guide to Host Online (Free)

To make your website accessible anywhere (on mobile phones, customer QR codes, and remote kitchen screens), host the **Backend on Render** and the **Frontend on Netlify**.

---

### STEP 1: Deploy the Backend on [Render.com](https://render.com) (Free)

1. Sign up for a free account at **[render.com](https://render.com)**.
2. Push your project code to **GitHub**.
3. In Render Dashboard, click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Configure the following settings:
   - **Name**: `aura-royale-api` (or any name you prefer)
   - **Root Directory**: `restaurant-live-portal/server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
6. Click **Create Web Service**.
7. Render will provide you with a live backend URL (e.g., `https://aura-royale-api.onrender.com`).
8. Copy this URL!

---

### STEP 2: Deploy the Frontend on [Netlify](https://netlify.com) (Free)

#### Method A: Connect with GitHub (Auto-updates on commit)
1. Go to **[netlify.com](https://netlify.com)** and log in.
2. Click **"Add new site"** > **"Import an existing project"** > select **GitHub**.
3. Select your repository and configure:
   - **Base directory**: `restaurant-live-portal/client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Environment variables** > **Add variable**:
   - **Key**: `VITE_BACKEND_URL`
   - **Value**: `https://aura-royale-api.onrender.com` *(your Render backend URL from Step 1)*
5. Click **Deploy Site**.
6. In ~60 seconds, Netlify will give you a live HTTPS link (e.g. `https://aura-royale.netlify.app`)!

#### Method B: Drag & Drop (Instant Manual Deploy)
1. In `client/`, build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
3. Drag and drop the `client/dist` folder into the Netlify box.
4. Your site will be live instantly!

---

## ⚙️ Technologies Used
- **Frontend**: React 19, Vite, Socket.IO Client, Web Audio API
- **Backend**: Node.js, Express, Socket.IO, CORS
- **Storage**: Persistent JSON database engine (`data/`)
- **Hosting**: Netlify (Frontend) + Render / Railway (Backend)
