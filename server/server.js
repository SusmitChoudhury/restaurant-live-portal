import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend clients (development & production)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.use(cors());
app.use(express.json());

const MENU_FILE = path.join(__dirname, 'data', 'menu.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Helper functions for persistent JSON DB
function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

// ---------------- REST API ----------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Menu Endpoints
app.get('/api/menu', (req, res) => {
  const menu = readJSON(MENU_FILE);
  res.json(menu);
});

app.post('/api/menu/toggle-stock', (req, res) => {
  const { itemId } = req.body;
  const menu = readJSON(MENU_FILE);
  const item = menu.find(i => i.id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.isAvailable = !item.isAvailable;
  writeJSON(MENU_FILE, menu);

  // Broadcast real-time stock change to all connected clients (customers + admin)
  io.emit('menu:stock_updated', {
    itemId: item.id,
    isAvailable: item.isAvailable,
    menu
  });

  res.json({ success: true, item, menu });
});

// Orders Endpoints
app.get('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { tableNumber, items, total, customerNotes } = req.body;
  if (!tableNumber || !items || items.length === 0) {
    return res.status(400).json({ error: 'Table number and items required' });
  }

  const orders = readJSON(ORDERS_FILE);
  const newOrder = {
    id: 'ORD-' + Date.now().toString().slice(-6),
    tableNumber: String(tableNumber),
    items,
    total: Number(total) || 0,
    customerNotes: customerNotes || '',
    status: 'pending', // 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled'
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder); // Prepend to show newest first
  writeJSON(ORDERS_FILE, orders);

  // Broadcast to all admins in real time
  io.emit('order:new', newOrder);

  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeJSON(ORDERS_FILE, orders);

  // Broadcast update to both admin and customer screens
  io.emit('order:updated', order);

  res.json(order);
});

// ---------------- WebSockets (Socket.IO) ----------------
io.on('connection', (socket) => {
  console.log(`[Socket Connected] Client ID: ${socket.id}`);

  // Send current menu & orders upon request
  socket.on('menu:get', (callback) => {
    const menu = readJSON(MENU_FILE);
    if (typeof callback === 'function') callback(menu);
  });

  socket.on('orders:get', (callback) => {
    const orders = readJSON(ORDERS_FILE);
    if (typeof callback === 'function') callback(orders);
  });

  // Client creates an order via WebSocket
  socket.on('order:create', (orderData, callback) => {
    try {
      const orders = readJSON(ORDERS_FILE);
      const newOrder = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        tableNumber: String(orderData.tableNumber || '1'),
        items: orderData.items || [],
        total: Number(orderData.total) || 0,
        customerNotes: orderData.customerNotes || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      orders.unshift(newOrder);
      writeJSON(ORDERS_FILE, orders);

      // Broadcast to all connected clients (Admin portal auto-updates!)
      io.emit('order:new', newOrder);

      if (typeof callback === 'function') callback({ success: true, order: newOrder });
    } catch (err) {
      console.error('Socket order:create error:', err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  // Admin updates order status (Pending -> Preparing -> Served -> Completed)
  socket.on('order:update_status', ({ orderId, status }, callback) => {
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find(o => o.id === orderId);

    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      writeJSON(ORDERS_FILE, orders);

      io.emit('order:updated', order);
      if (typeof callback === 'function') callback({ success: true, order });
    } else {
      if (typeof callback === 'function') callback({ success: false, error: 'Order not found' });
    }
  });

  // Admin toggles menu item in stock / out of stock
  socket.on('menu:toggle_stock', ({ itemId }, callback) => {
    const menu = readJSON(MENU_FILE);
    const item = menu.find(i => i.id === itemId);

    if (item) {
      item.isAvailable = !item.isAvailable;
      writeJSON(MENU_FILE, menu);

      // Instantly push stock update to all connected customer menus
      io.emit('menu:stock_updated', {
        itemId: item.id,
        isAvailable: item.isAvailable,
        menu
      });

      if (typeof callback === 'function') callback({ success: true, item, menu });
    } else {
      if (typeof callback === 'function') callback({ success: false, error: 'Item not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] Client ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Restaurant Real-Time Server running on port ${PORT}`);
});

