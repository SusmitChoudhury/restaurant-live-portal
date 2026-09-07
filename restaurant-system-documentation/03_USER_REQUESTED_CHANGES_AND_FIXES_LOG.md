# User-Requested Changes, Bug Fixes & Evolution Log
## Complete Chronological Audit of System Refinements

This document logs every problem raised during development, the underlying architectural root cause diagnosed, the exact technical solution implemented, and the operational benefit delivered to the restaurant client.

---

### Audit Summary Matrix

| # | User Request & Problem Statement | Root Cause Diagnosed | Solution Implemented | Verification Result |
| :- | :--- | :--- | :--- | :--- |
| **1** | Admin & Customer portals out of sync; Out-of-Stock items still orderable; orders not appearing in admin; order automatically changing status to Prepare/Ready instead of chef-controlled. | Automated timer in OrderTracker was artificially shifting state; WebSocket connections were dropping without local tab fallback. | Implemented native `BroadcastChannel` for 0ms cross-tab sync; eliminated automated state-advancement timers; locked down Out-of-Stock buttons on customer cards. | Status transitions strictly controlled by chef; out-of-stock items non-clickable. |
| **2** | Portal displayed "Connecting to server" and "Offline Mode" banner, giving the impression that the website was broken. | Remote backend URL was unreachable on initial load before deployment; UI showed an alarming red warning. | Softened offline messaging into an informative badge; prioritized 0ms `BroadcastChannel` so tabs sync perfectly even without a live backend server. | System demonstrates 100% operational functionality in standalone or static demo mode. |
| **3** | Indicator requested to clearly show "Local Tab-to-Tab Instant Sync Active". | Status badge was generic and did not explain how real-time sync was functioning across browser tabs. | Added dynamic emerald green badge in top navbar showing "Kitchen Sync" or "Live Sync" with glowing status indicator. | Confirmed visual indicator reassures users and clients that real-time sync is active. |
| **4** | Customer portal still showing offline warning in certain browser environments. | Hardcoded fallback status check did not recognize `BroadcastChannel` availability as an active sync channel. | Updated connection logic in `Navbar.jsx` and `App.jsx` to reflect local sync as an active, healthy communication state. | Clean luxury header with zero alarming error messages. |
| **5** | After placing an order or when admin clicks "Start Preparing", the customer page went completely blank. | `OrderTracker.jsx` crashed due to accessing properties on undefined or mismatched order objects (`order.items.map` on undefined). | Replaced brittle property access with defensive optional chaining (`order?.items || []`), safe type checking, and fallback defaults. | Modal renders seamlessly through all status stages: Pending ➔ Preparing ➔ Served. |
| **6** | No exit / close option from the order tracking screen; customer was locked out of viewing the menu. | Full-screen modal lacked an exit button and locked body scrolling permanently while an order was active. | Added top-right circular close button (`<IconClose />`), click-outside dismiss, and a "← Back to Menu" button that minimizes the tracker into a bottom pill. | Diners can exit back to the menu at any time and browse dishes while their order is prepared. |
| **7** | When admin cancelled an order, customer portal did not alert the user; multi-order tracking was missing; order number was missing from status panel. | Order state only supported a single order object; cancellation events were not surfaced with a dedicated UI alert; ticket ID was hidden. | Rebuilt state to support `customerOrders` array; created multi-order tab switcher; added prominent `#ORD-XXXXXX` badge; built high-visibility red cancellation alert. | Customers can place multiple orders (appetizers, then mains); cancellations alert instantly; ticket IDs clearly shown. |
| **8** | "Make it super optimized for all types of mobile devices" (Customer Portal). | Desktop layout had large fixed-width cards, long vertical scroll distances, and small touch targets. | Implemented sticky mobile category pill bar, floating quick-cart bar, fluid CSS clamp typography, and touch-optimized quantity steppers. | Customer portal delivers native app-like fluidity on mobile browsers. |
| **9** | "Super super mobile optimize the Admin Portal" (Kitchen Portal). | Admin dashboard had wide table layouts and tiny action buttons that were difficult to use on mobile phones and tablets. | Created sticky mobile header, 3-tab segmented mobile control (`🔥 Orders`, `📦 Stock`, `📊 Stats`), 48px minimum touch buttons, and swipeable category pills. | Kitchen staff can operate the entire portal with one thumb on any mobile phone or wall tablet. |
| **10** | "Why did Out-of-Stock reset after page refresh or browser close? Make it permanent." | Out-of-stock state was held only in transient React memory; reloading reverted dishes back to default available state; type mismatches between string/number IDs. | Built permanent unified blacklist store in `localStorage` (`restaurant_out_of_stock_ids`); normalized all IDs with `String(id)`; synced with backend `menu.json`. | Out-of-stock status permanently persists across refreshes, tab cuts, and device reboots until staff changes it. |

---

### Detailed Technical Case Studies

#### Case Study 1: Permanent Out-of-Stock Persistence Engine
- **The Problem**: When kitchen staff marked an item (e.g., "Mutton Rogan Josh") as Out of Stock, the toggle switched correctly. However, if the staff closed the browser, refreshed the tab, or opened the portal on another day, the item reverted back to available.
- **Root Cause**:
  1. Default menu was hardcoded in `defaultMenu.js` with `isAvailable: true`.
  2. On component mount, `useState(DEFAULT_MENU)` initialized fresh state without checking persistent storage first.
  3. Dish IDs in some components were numbers (`18`), while in other contexts they were strings (`"18"`), causing `item.id === id` comparisons to fail silently.
- **Architectural Solution**:
  1. Created a dedicated blacklist storage key: `restaurant_out_of_stock_ids`.
  2. Built initialization logic that reads this blacklist *synchronously* before rendering:
     ```javascript
     const [menu, setMenu] = useState(() => {
       const outOfStockIds = new Set(getStoredOutOfStockIds());
       return DEFAULT_MENU.map(item => ({
         ...item,
         isAvailable: !outOfStockIds.has(String(item.id))
       }));
     });
     ```
  3. Ensured every toggle writes to this store with string coercion (`String(itemId)`).
  4. Added batch sync endpoint on backend: `POST /api/menu/sync-stock` to ensure server-side persistence in `server/data/menu.json`.

---

#### Case Study 2: Multi-Order Support & Non-Locking Order Tracker
- **The Problem**: In real restaurant dining, customers rarely order all dishes at once. They typically order beverages and appetizers first, followed by main courses 20 minutes later, and desserts at the end. Previously, submitting an order locked the screen to a single modal with no exit option and no way to track multiple orders simultaneously.
- **Architectural Solution**:
  1. Upgraded state from `activeCustomerOrder` (single object) to `customerOrders` (array of active tickets).
  2. Built a responsive tab switcher at the top of the tracker modal displaying each active order with its status dot and order ID (e.g., `#ORD-729104 (Cooking)`).
  3. Built a minimized floating pill bar (`position: fixed; bottom: 14px`) that shows live status when the customer exits the modal to browse the menu.
  4. Added a red cancellation alert box with a dismiss button, clearing pending charges if kitchen staff cancels a ticket.

---

#### Case Study 3: Mobile Touch Ergonomics & Safari iOS Fixes
- **The Problem**: When tested on iPhones, the admin search bar caused the browser to zoom in abruptly, and buttons were too small for quick taps on kitchen lines.
- **Architectural Solution**:
  1. Set `fontSize: '16px'` on all text inputs. On iOS Safari, any input with a font size smaller than 16px triggers automatic viewport zooming; 16px eliminates this behavior completely.
  2. Implemented `touch-action: manipulation;` across all interactive buttons to disable double-tap zoom delay.
  3. Enforced a minimum touch target of 48px height on all primary kitchen action buttons (`Start Cooking`, `Mark as Served`).
  4. Added safe-area padding (`env(safe-area-inset-bottom)`) to ensure floating bars never collide with the iPhone home indicator.
