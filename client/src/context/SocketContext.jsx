import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

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
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeCustomerOrder, setActiveCustomerOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  const socketRef = useRef();

  useEffect(() => {
    // In production, user points VITE_BACKEND_URL to their Render backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || (
      window.location.hostname === 'localhost' ? 'http://localhost:5001' : window.location.origin
    );

    const s = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      timeout: 10000
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to real-time server:', s.id);
      setConnected(true);

      // Fetch initial menu
      s.emit('menu:get', (initialMenu) => {
        if (initialMenu) setMenu(initialMenu);
      });

      // Fetch initial orders
      s.emit('orders:get', (initialOrders) => {
        if (initialOrders) setOrders(initialOrders);
      });
    });

    s.on('disconnect', () => {
      console.log('Disconnected from real-time server');
      setConnected(false);
    });

    // Real-time stock change listener
    s.on('menu:stock_updated', (data) => {
      console.log('[Live Event] Stock updated:', data);
      if (data.menu) {
        setMenu(data.menu);
      } else {
        setMenu(prev => prev.map(item => item.id === data.itemId ? { ...item, isAvailable: data.isAvailable } : item));
      }
    });

    // Real-time incoming new order listener (for Admin & Sound)
    s.on('order:new', (newOrder) => {
      console.log('[Live Event] New incoming order:', newOrder);
      setOrders(prev => [newOrder, ...prev]);
      playOrderChime();
      setNotification(`🔔 New Order from Table ${newOrder.tableNumber}!`);
      setTimeout(() => setNotification(null), 4000);
    });

    // Real-time order status listener
    s.on('order:updated', (updatedOrder) => {
      console.log('[Live Event] Order updated:', updatedOrder);
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));

      // Update active customer order if matches
      setActiveCustomerOrder(prev => (prev && prev.id === updatedOrder.id ? updatedOrder : prev));
    });

    // Fallback REST fetch on mount if websocket is slow
    fetch(`${backendUrl}/api/menu`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMenu(data); })
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
    if (socket && connected) {
      socket.emit('menu:toggle_stock', { itemId });
    } else {
      // REST fallback
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      fetch(`${backendUrl}/api/menu/toggle-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      }).then(res => res.json()).then(res => {
        if (res.menu) setMenu(res.menu);
      });
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
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
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
          .catch(() => resolve(null));
      }
    });
  };

  const updateOrderStatus = (orderId, status) => {
    if (socket && connected) {
      socket.emit('order:update_status', { orderId, status });
    } else {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      fetch(`${backendUrl}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
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
