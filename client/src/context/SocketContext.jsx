import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { DEFAULT_MENU } from '../data/defaultMenu';

const SocketContext = createContext();

// Play a pleasant restaurant notification chime using Web Audio API
export const playOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // High note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Higher note 2
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime); // A5
      gain2.gain.setValueAtTime(0.18, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.6);
    }, 150);
  } catch (err) {
    console.warn('Audio chime note failed:', err);
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  // Default menu is seeded immediately so the UI is never empty!
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [orders, setOrders] = useState([]);
  const [activeCustomerOrder, setActiveCustomerOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  const socketRef = useRef();

  // Helper to merge live server availability with local menu images & details
  const mergeMenuData = (serverMenu) => {
    if (!Array.isArray(serverMenu) || serverMenu.length === 0) return;
    setMenu(prevMenu => {
      return prevMenu.map(localItem => {
        const serverItem = serverMenu.find(s => s.id === localItem.id || String(s.id) === String(localItem.id));
        if (serverItem) {
          return {
            ...localItem,
            isAvailable: serverItem.isAvailable !== false,
            // also allow server price overrides if updated
            price: serverItem.price || localItem.price
          };
        }
        return localItem;
      });
    });
  };

  useEffect(() => {
    // Determine backend URL
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    let backendUrl = envUrl ? envUrl.replace(/\/$/, '') : null;
    
    if (!backendUrl) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        backendUrl = 'http://localhost:5001';
      }
    }

    if (!backendUrl) {
      console.warn('[SocketContext] No VITE_BACKEND_URL configured. Running with local offline menu.');
      return;
    }

    const s = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 2000,
      timeout: 15000
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to real-time kitchen server:', s.id);
      setConnected(true);

      // Fetch initial menu availability
      s.emit('menu:get', (initialMenu) => {
        if (initialMenu) mergeMenuData(initialMenu);
      });

      // Fetch initial orders (for admin)
      s.emit('orders:get', (initialOrders) => {
        if (Array.isArray(initialOrders)) setOrders(initialOrders);
      });
    });

    s.on('disconnect', () => {
      console.log('Disconnected from real-time server');
      setConnected(false);
    });

    // Real-time stock change listener (broadcast by admin)
    s.on('menu:stock_updated', (data) => {
      console.log('[Live Event] Stock updated:', data);
      setMenu(prev => prev.map(item => {
        if (item.id === data.itemId || String(item.id) === String(data.itemId)) {
          return { ...item, isAvailable: data.isAvailable };
        }
        return item;
      }));
    });

    // Real-time incoming new order listener (for Admin & Sound)
    s.on('order:new', (newOrder) => {
      console.log('[Live Event] New incoming order:', newOrder);
      setOrders(prev => [newOrder, ...prev]);
      playOrderChime();
      setNotification(`🔔 New Order from Table ${newOrder.tableNumber}!`);
      setTimeout(() => setNotification(null), 4000);
    });

    // Real-time order status listener (for Customer Tracker & Admin)
    s.on('order:updated', (updatedOrder) => {
      console.log('[Live Event] Order updated:', updatedOrder);
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));

      // Update active customer order if matches
      setActiveCustomerOrder(prev => (prev && prev.id === updatedOrder.id ? updatedOrder : prev));
    });

    // Fallback initial REST fetch
    fetch(`${backendUrl}/api/menu`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) mergeMenuData(data); })
      .catch(() => {});

    fetch(`${backendUrl}/api/orders`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {});

    return () => {
      s.disconnect();
    };
  }, []);

  // Actions
  const toggleStock = (itemId) => {
    // Optimistically update local state immediately
    setMenu(prev => prev.map(item => {
      if (item.id === itemId || String(item.id) === String(itemId)) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    }));

    if (socket && connected) {
      socket.emit('menu:toggle_stock', { itemId });
    } else {
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');
      fetch(`${backendUrl}/api/menu/toggle-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      }).catch(err => console.error('REST toggle-stock failed:', err));
    }
  };

  const placeOrder = (orderData) => {
    return new Promise((resolve) => {
      if (socket && connected) {
        socket.emit('order:create', orderData, (response) => {
          if (response?.order) {
            setActiveCustomerOrder(response.order);
            resolve(response.order);
          } else {
            resolve(null);
          }
        });
      } else {
        // REST fallback
        const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');
        fetch(`${backendUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })
          .then(res => res.json())
          .then(newOrder => {
            setActiveCustomerOrder(newOrder);
            resolve(newOrder);
          })
          .catch(() => {
            // Local mock order if completely offline
            const localOrder = {
              id: 'ORD-' + Date.now().toString().slice(-6),
              tableNumber: String(orderData.tableNumber || '1'),
              items: orderData.items || [],
              total: Number(orderData.total) || 0,
              customerNotes: orderData.customerNotes || '',
              status: 'pending',
              createdAt: new Date().toISOString()
            };
            setActiveCustomerOrder(localOrder);
            resolve(localOrder);
          });
      }
    });
  };

  const updateOrderStatus = (orderId, status) => {
    // Optimistically update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (socket && connected) {
      socket.emit('order:update_status', { orderId, status });
    } else {
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');
      fetch(`${backendUrl}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(() => {});
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      menu,
      orders,
      activeCustomerOrder,
      setActiveCustomerOrder,
      toggleStock,
      placeOrder,
      updateOrderStatus,
      notification
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
