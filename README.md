<div align="center">

# 🍽️ Aura Royale — Smart Dining & Real-Time Kitchen Portal
### Enterprise Contactless Dining, Live Order Stream & Real-Time Kitchen Display System (KDS)

[![Netlify Status](https://api.netlify.com/api/v1/badges/9c8b7468-b715-46f9-813c-0e7d69b9f7a9/deploy-status)](https://restaurant-live-portal.netlify.app/)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=nodedotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=flat&logo=socketdotio&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)

<br />

### 🌐 Live Production Deployments — Test in Real Time!

| Portal Type | Direct Access Link | Access Credentials |
| :--- | :--- | :--- |
| 📱 **Customer / Dining Portal** | [**View Customer Portal →**](https://restaurant-live-portal.netlify.app/) | Open to all dining guests (QR scan) |
| 👨‍🍳 **Restaurant Admin & Kitchen Portal** | [**View Admin Portal →**](https://restaurant-live-portal.netlify.app/admin) | Passcode: `Smile@123` |

> 💡 **Try the Live Cross-Tab Synchronization Demo**:
> Open the **Customer Portal** in one browser window and the **Admin Portal** side-by-side in another. Place an order on the customer side or toggle a dish "Out of Stock" on the admin side — watch both screens update in **0ms real time with an acoustic kitchen chime**!

</div>

---

## 📖 Overview

**Aura Royale** is a production-ready, contactless dining platform engineered for luxury restaurants, bistros, cafes, lounges, and bars. It provides an end-to-end digital ordering ecosystem that eliminates the 20% to 35% commission fees charged by third-party delivery aggregators (Swiggy, Zomato, DoorDash, UberEats).

Traditional restaurant operations struggle with handwritten order errors, slow table turnaround times, out-of-stock communication delays, and paper menu reprint costs. Aura Royale eliminates these bottlenecks with an intuitive, app-less progressive web portal for dining guests coupled with a high-velocity kitchen management dashboard.

---

## ⚡ Key Highlights & Core Capabilities

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER DINING PORTAL                   │
│           https://restaurant-live-portal.netlify.app/       │
├─────────────────────────────────────────────────────────────┤
│ • 66+ Gourmet Dishes across 7 culinary categories           │
│ • Interactive Dining Table Selector (T1–T12+) with seats    │
│ • Sticky Mobile Category Navigation with live dish counts   │
│ • Floating Quick-Cart Bar with live bill total in ₹         │
│ • Add-On Extras Engine (Cheese, Truffle, Dips) & Chef Notes │
│ • Live Multi-Order Tracker (#ORD-XXXXXX) with background bar│
│ • Real-time Out-of-Stock Lockdown (grayscale dimming)       │
└───────────────┬─────────────────────────────▲───────────────┘
                │                             │
                │ 0ms BroadcastChannel        │ Live Status Updates
                │ & Cloud WebSockets          │ & Permanent Stock Sync
                ▼                             │
┌─────────────────────────────────────────────────────────────┐
│                 KITCHEN & ADMIN DASHBOARD                   │
│        https://restaurant-live-portal.netlify.app/admin     │
├─────────────────────────────────────────────────────────────┤
│ • Secure Password Gatekeeper (Smile@123)                    │
│ • Live Ticket Stream with High-Visibility Table Badges      │
│ • Synthesized Acoustic Web Audio Chimes on new orders       │
│ • Chef-Controlled Lifecycle: Pending ➔ Cooking ➔ Served    │
│ • 1-Tap Permanent Inventory Out-of-Stock Controller         │
│ • "Show Only Out of Stock" Filter & Real-Time Search        │
│ • Real-Time Sales Analytics, Gross Revenue ₹, & Diagnostics │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Feature Breakdown

### 📱 1. Customer Dining Portal (`/`)
- **Luxury Visual Identity**: Built with rich glassmorphism aesthetics, ambient lighting glow effects, and modern typography (Playfair Display / Cormorant Garamond / Plus Jakarta Sans).
- **Table Selection Engine**: Interactive dining room floor plan (Tables T1–T12+) showing seat counts and availability. Table selection is permanently saved in browser storage and attached to all tickets.
- **Curated Artisanal Menu**: 66+ dishes with high-definition food photography, lazy loading, and broken-image fallback handling.
- **Sticky Mobile Navigation**: Category tabs stick below the navbar on mobile with automatic active scroll centering and live dish counts.
- **Customizable Add-Ons & Chef Notes**: Guests can customize orders with culinary extras (Artisanal Cheese, Truffle Dip, Extra Butter) and enter dietary allergies or spice requests directly to the kitchen.
- **Automated Tax & Service Charge**: Instant itemized calculation of Subtotal, GST (5%), and Service Charge (3%).
- **Mobile Floating Quick-Cart Bar**: Thumb-accessible bottom pill showing live bill total in INR (`₹`), dish count, and table pill with collision prevention.
- **Live Multi-Order Tracker**:
  - Tracks multiple active orders placed by the same table simultaneously via an intuitive tab switcher.
  - Prominent `#ORD-XXXXXX` ticket ID badge.
  - Real-time 3-stage progress: `Order Received` ➔ `Cooking` ➔ `Served`.
  - Minimizable to a floating bottom pill so guests can browse the menu and order more items while food cooks.
  - Instant red cancellation alert banner with pending charge clearance.

### 👨‍🍳 2. Kitchen & Admin Portal (`/admin`)
- **Protected Security Gatekeeper**: Password-restricted access (`Smile@123`) with session persistence across tablet reloads and quick shift logout.
- **Mobile-Optimized Header**: Sticky header with audio chime test button (`🔔`), customer view toggle (`🌐`), and cloud server link configuration (`⚙️`).
- **Segmented Mobile Tab Bar**: Ergonomically switch between `🔥 Orders (Active Count)`, `📦 Stock (Sold-Out Count)`, and `📊 Stats`.
- **Live Ticket Expediting Queue**:
  - High-visibility gold table badges (`TABLE #4`).
  - Itemized quantity tags (`2×`, `4×`) and highlighted customer allergy notes in bold amber callouts.
  - 48px minimum touch targets engineered for fast kitchen line operation.
  - Human-controlled status progression (`Start Cooking` ➔ `Mark as Served` ➔ `Archive`) with zero artificial auto-advancement.
- **Live Inventory & Out-of-Stock Controller**:
  - Instant toggle switches with **100% permanent persistence** in local storage and backend JSON storage (items remain out of stock across reloads/reboots).
  - Quick-filter button: `⚠️ Show Only Out of Stock`.
  - Full-width search bar with 16px font preventing iOS Safari auto-zoom.
- **Operational Analytics & Diagnostics**: Real-time gross sales counter in `₹`, average ticket size, active line volume, and engine health diagnostic readouts.

### ⚙️ 3. Core Architectural Engine
- **Dual-Mode Real-Time Synchronization**:
  - **Native `BroadcastChannel` API**: Delivers 0ms latency cross-tab synchronization with zero network overhead, enabling 100% functionality on static hosting (Netlify/Vercel).
  - **Cloud WebSockets (`Socket.IO`)**: Provides bidirectional multi-device synchronization across different networks with automatic reconnection and REST API fallbacks.
- **Zero-Asset Acoustic Audio Engine**: Synthesizes pure harmonic sine waves (587.33Hz & 880Hz) via the native Web Audio API directly in browser memory — zero external MP3 file dependencies.
- **Permanent Unified Blacklist**: Synchronous storage rehydration ensuring out-of-stock items never revert to available upon browser cut or device refresh.

---

## 📁 Repository Structure

```
restaurant-live-portal/
├── client/                                    # Frontend React SPA (Vite)
│   ├── public/
│   │   ├── _redirects                         # Netlify SPA routing rewrite rule
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/                        # Customer UI components
│   │   │   ├── Navbar.jsx                     # Glassmorphism navbar & table pill
│   │   │   ├── Hero.jsx                       # Ambiance hero & CTA triggers
│   │   │   ├── Menu.jsx                       # 66+ dish menu & sticky category bar
│   │   │   ├── CartDrawer.jsx                 # Slide-in cart, extras & billing breakdown
│   │   │   ├── MobileFloatingCart.jsx         # Mobile thumb quick-cart pill
│   │   │   ├── TableSelector.jsx              # Interactive table floor plan modal
│   │   │   ├── OrderTracker.jsx               # Multi-order live status modal & mini pill
│   │   │   ├── Icons.jsx                      # Lightweight vector SVG icon library
│   │   │   ├── ChefSpecial.jsx                # Signature dishes showcase
│   │   │   ├── AboutSection.jsx               # Heritage & culinary story
│   │   │   ├── StatsCounter.jsx               # Social proof statistics
│   │   │   ├── Gallery.jsx                    # Ambiance photography gallery
│   │   │   ├── Testimonials.jsx               # Verified patron reviews
│   │   │   ├── Footer.jsx                     # Contact, hours & location
│   │   │   └── admin/                         # Kitchen & Staff components
│   │   │       ├── AdminDashboard.jsx         # Main kitchen portal & segmented tabs
│   │   │       ├── AdminLogin.jsx             # Password gatekeeper (Smile@123)
│   │   │       ├── OrderCard.jsx              # Expediting card with 48px touch controls
│   │   │       ├── StockManager.jsx           # Live inventory toggles & search
│   │   │       └── AdminStats.jsx             # Gross sales ₹ & operational metrics
│   │   ├── context/
│   │   │   ├── CartContext.jsx                # Cart items, extras, taxes, table state
│   │   │   └── SocketContext.jsx              # BroadcastChannel + WebSocket + Web Audio
│   │   ├── data/
│   │   │   └── defaultMenu.js                 # 66-dish gourmet menu dataset
│   │   ├── index.css                          # Design tokens, glassmorphism & responsive CSS
│   │   ├── App.jsx                            # PushState routing & notification toast
│   │   └── main.jsx
│   ├── package.json                           # React 18, Vite, Socket.IO Client
│   └── vite.config.js
├── server/                                    # Real-time Node.js backend
│   ├── data/
│   │   ├── menu.json                          # Persistent stock database
│   │   └── orders.json                        # Persistent order history database
│   ├── package.json                           # Express, Socket.IO, CORS
│   └── server.js                              # WebSocket & REST API server (Port 5001)
├── restaurant-system-documentation/           # Comprehensive Client & Developer Docs
│   ├── README.md                              # Documentation suite overview
│   ├── 01_EXECUTIVE_SYSTEM_DIAGNOSIS_AND_ARCHITECTURE.md
│   ├── 02_FULL_FEATURE_CATALOG_AND_DIAGNOSTIC_TABLES.md
│   ├── 03_USER_REQUESTED_CHANGES_AND_FIXES_LOG.md
│   ├── 04_CLIENT_PROPOSAL_AND_PITCH_DECK.md
│   └── 05_TECHNICAL_SPECIFICATION_AND_CUSTOMIZATION_GUIDE.md
├── netlify.toml                               # Netlify production build configuration
├── package.json                               # Convenient root scripts
└── README.md
```

---

## 📚 Complete System Documentation Suite

For exhaustive technical and client-facing documentation, explore the files in the [`restaurant-system-documentation/`](./restaurant-system-documentation/) directory:

1. **[01_EXECUTIVE_SYSTEM_DIAGNOSIS_AND_ARCHITECTURE.md](./restaurant-system-documentation/01_EXECUTIVE_SYSTEM_DIAGNOSIS_AND_ARCHITECTURE.md)**: Architectural blueprint, zero-commission economics, data schemas, and state flowcharts.
2. **[02_FULL_FEATURE_CATALOG_AND_DIAGNOSTIC_TABLES.md](./restaurant-system-documentation/02_FULL_FEATURE_CATALOG_AND_DIAGNOSTIC_TABLES.md)**: Master diagnostic tables cataloging **every single feature, micro-interaction, correction, and UI/UX element** across both portals.
3. **[03_USER_REQUESTED_CHANGES_AND_FIXES_LOG.md](./restaurant-system-documentation/03_USER_REQUESTED_CHANGES_AND_FIXES_LOG.md)**: Itemized audit of every user-requested problem, root cause diagnosed, code fix applied, and validation outcome.
4. **[04_CLIENT_PROPOSAL_AND_PITCH_DECK.md](./restaurant-system-documentation/04_CLIENT_PROPOSAL_AND_PITCH_DECK.md)**: Sales proposal template for pitching restaurant owners, featuring an annual ROI commission savings calculator.
5. **[05_TECHNICAL_SPECIFICATION_AND_CUSTOMIZATION_GUIDE.md](./restaurant-system-documentation/05_TECHNICAL_SPECIFICATION_AND_CUSTOMIZATION_GUIDE.md)**: Technical guide for white-labeling the brand, adding dishes, customizing taxes, and deploying to cloud infrastructure.

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone Repository
```bash
git clone https://github.com/SusmitChoudhury/restaurant-live-portal.git
cd restaurant-live-portal
```

### 2. Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend server runs at: `http://localhost:5001`*

### 3. Start Frontend Client (in a second terminal)
```bash
cd client
npm install
npm run dev
```
*Frontend dev server runs at: `http://localhost:5174`*

---

## 🌐 Deployment Guide

### Deploying Frontend to Netlify
1. Connect this repository to **[Netlify](https://netlify.com)**.
2. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add Environment Variable:
   - `VITE_BACKEND_URL`: `https://your-backend-server.railway.app` (optional; falls back gracefully to `BroadcastChannel` if empty).
4. Click **Deploy Site**.

### Deploying Backend to Railway / Render
1. Create a new service from this repo on **[Railway](https://railway.app)** or **[Render](https://render.com)**.
2. Set **Root Directory** to `server`.
3. Set **Start Command** to `node server.js`.
4. Expose port `5001` (or use the platform `$PORT` variable).

---

## 🔒 Security & Admin Access
- **Default Staff PIN**: `Smile@123`
- To update credentials, edit `client/src/components/admin/AdminLogin.jsx`.

---

## 📄 License
This project is licensed under the **MIT License** — open for personal, commercial, and client white-label deployments.
