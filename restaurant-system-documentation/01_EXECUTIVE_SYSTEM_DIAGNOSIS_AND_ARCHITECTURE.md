# Executive System Diagnosis & Architecture
## Aura Royale Smart Dining & Kitchen Portal

---

### 1. Executive Summary & Vision

The **Aura Royale Smart Dining & Kitchen Portal** is an enterprise-grade, real-time web application tailored for luxury restaurants, bistros, cafes, and bars. It provides an end-to-end contactless dining solution that bridges the physical table dining experience with high-speed kitchen operations.

Modern food service establishments lose between **20% to 35% of their gross revenue** to third-party delivery and ordering aggregators (e.g., Zomato, Swiggy, DoorDash, UberEats). Furthermore, traditional paper menu operations suffer from:
1. **High Reprint Costs**: Any price revision or menu adjustment requires expensive reprints.
2. **Kitchen-Floor Communication Delays**: Waitstaff taking handwritten notes leads to transcription mistakes, incorrect allergy notifications, and delays during peak lunch and dinner rushes.
3. **Out-of-Stock Embarrassment**: Guests order items only to be told 10 minutes later by embarrassed servers that the kitchen ran out of ingredients.
4. **Slow Table Turnover**: Guests waiting 10–15 minutes just to request a menu, order additional drinks, or flag down servers for the check.

The Aura Royale system solves every single one of these operational pain points through a **zero-friction, app-less progressive web ecosystem**:
- **Guests** sit at any table, view a curated, high-definition digital menu, customize orders with add-ons and chef notes, select their table number, and order instantly.
- **Kitchen Staff & Head Chefs** receive new tickets within milliseconds on kitchen tablets or mobile devices, alerted by pleasant acoustic chimes, and maintain absolute control over preparation states.
- **Restaurant Managers** control live stock availability with single-tap toggles that lock down sold-out dishes across all customer devices in real time with permanent persistence.

---

### 2. High-Level Architectural Topology

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     CUSTOMER PORTAL                         │
   │               (Mobile Smartphones / Tablets)                │
   │  - Luxury Hero & Ambient Glow    - Sticky Category Navigation │
   │  - 66+ Dish Artisanal Menu       - Live Out-of-Stock Lockdown │
   │  - Quantity Steppers & Extras    - Allergy / Chef Note Input  │
   │  - Table Identification Engine   - Multi-Order Live Tracker   │
   └───────────────┬─────────────────────────────▲───────────────┘
                   │                             │
                   │ Order Dispatch              │ Status Updates
                   │ (Items, Table, Notes)       │ & Live Stock Sync
                   ▼                             │
   ┌─────────────────────────────────────────────────────────────┐
   │            DUAL-MODE REAL-TIME SYNC ENGINE                  │
   │                                                             │
   │  [Layer 1: 0ms Cross-Tab Native Channel]                    │
   │  - Native BroadcastChannel API                              │
   │  - Zero network overhead, works on static Netlify/Vercel    │
   │                                                             │
   │  [Layer 2: Cloud WebSocket Pipeline]                        │
   │  - Bidirectional Socket.IO with WebSocket/Polling fallback  │
   │  - Instant multi-device sync across different networks      │
   │                                                             │
   │  [Layer 3: Permanent Persistence Store]                     │
   │  - Unified Blacklist Engine (localStorage + JSON Storage)   │
   │  - Out-of-stock items NEVER reset upon page refresh/reload  │
   └───────────────┬─────────────────────────────▲───────────────┘
                   │                             │
                   │ Instant Ticket Pop-up       │ Real-time Stock Toggle
                   │ & Synthesized Audio Chime   │ & Kitchen Status Changes
                   ▼                             │
   ┌─────────────────────────────────────────────────────────────┐
   │                 KITCHEN & ADMIN PORTAL                      │
   │              (Kitchen Tablet / POS / Phone)                 │
   │  - Password Gatekeeper (Smile@123)                          │
   │  - Live Order Queue (Pending ➔ Cooking ➔ Served ➔ Archive)  │
   │  - Web Audio API Synthesized Chimes (Zero External Assets)  │
   │  - 1-Tap Permanent Inventory & Out-of-Stock Toggle Switches │
   │  - "Show Only Out of Stock" Filter & Search Engine          │
   │  - Real-Time Revenue, Average Ticket, & Diagnostics Stats   │
   └─────────────────────────────────────────────────────────────┘
```

---

### 3. Core System Data Models

#### 3.1 Order Schema
```json
{
  "id": "ORD-739281",
  "tableNumber": "4",
  "items": [
    {
      "id": 18,
      "name": "Hyderabadi Dum Biryani",
      "price": 420,
      "qty": 2
    },
    {
      "id": 42,
      "name": "Garlic Naan",
      "price": 95,
      "qty": 3
    }
  ],
  "extras": [
    {
      "id": "ex-cheese",
      "name": "Extra Artisanal Cheese",
      "price": 60,
      "qty": 1
    }
  ],
  "customerNotes": "Mild spice for the biryani please. Allergic to peanuts.",
  "status": "pending",
  "total": 1308.25,
  "createdAt": "2026-09-08T00:30:15.000Z",
  "updatedAt": "2026-09-08T00:32:40.000Z"
}
```

#### 3.2 Menu Item & Inventory Schema
```json
{
  "id": 18,
  "name": "Hyderabadi Dum Biryani",
  "category": "Biryani & Basmati Rice",
  "price": 420,
  "description": "Slow-cooked fragrant aged basmati rice layered with spiced marinated meat, saffron, and caramelised onions.",
  "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&q=80",
  "isAvailable": true
}
```

---

### 4. Zero Auto-Advancement Philosophy

A common flaw in rudimentary restaurant prototypes is the use of automated timer triggers (e.g., automatically changing an order from "Pending" to "Cooking" after 15 seconds, and then "Ready" after 30 seconds).

In an actual operating commercial kitchen:
1. Every order requires chef acceptance based on line load, prep station capacity, and tandoor temperature.
2. Orders take varying amounts of time depending on complexity (e.g., a cold beverage takes 2 minutes; a slow-cooked dum biryani takes 18 minutes).
3. **Aura Royale enforces a strict, chef-controlled lifecycle**:
   - `pending`: Customer placed order. Kitchen alert sounds. Order highlighted in amber.
   - `preparing`: Kitchen chef clicks **"👨‍🍳 Start Cooking"**. Status updates immediately on customer screen.
   - `served`: Kitchen expeditor clicks **"🍽️ Mark as Served at Table"**. Customer sees order delivered hot to their table.
   - `completed`: Order archived into daily history and accounting records.
   - `cancelled`: If cancelled by the chef due to unforeseen shortages, the customer receives an immediate high-visibility red cancellation notice with full reason disclosure and pending charge clearance.

---

### 5. Multi-Layer Persistence Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OUT-OF-STOCK ENGINE                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Staff toggles dish off in Admin Portal                   │
│ 2. Dish ID added to localStorage 'restaurant_out_of_stock_ids'│
│ 3. BroadcastChannel message 'STOCK_TOGGLED' fires           │
│ 4. WebSocket 'menu:toggle_stock' emits to cloud backend     │
│ 5. Backend updates server/data/menu.json via atomic write   │
│ 6. On any page refresh, browser reads blacklist FIRST:      │
│    Array.from(new Set(getStoredOutOfStockIds()))            │
│ 7. Result: Dish stays permanently locked out of stock       │
└─────────────────────────────────────────────────────────────┘
```

This triple-redundant approach ensures that even if a tablet powers off, the browser crashes, or the kitchen switches devices, the out-of-stock state is never lost.
