import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { DEFAULT_MENU } from '../data/defaultMenu';

const SocketContext = createContext();

// Play pleasant restaurant notification chime
export const playOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime);
      gain2.gain.setValueAtTime(0.25, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.6);
    }, 150);
  } catch (err) {
    console.warn('Audio chime failed:', err);
  }
};

// Permanent out-of-stock storage key
const OUT_OF_STOCK_STORAGE_KEY = 'restaurant_out_of_stock_ids';

const getStoredOutOfStockIds = () => {
  try {
    const raw = localStorage.getItem(OUT_OF_STOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    }
  } catch {}
  return [];
};

const saveStoredOutOfStockIds = (ids) => {
  try {
    const unique = Array.from(new Set(ids.map(String)));
    localStorage.setItem(OUT_OF_STOCK_STORAGE_KEY, JSON.stringify(unique));
  } catch {}
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  // Initialize menu from permanent out-of-stock store + legacy cached availability
  const [menu, setMenu] = useState(() => {
    const outOfStockIds = new Set(getStoredOutOfStockIds());
    try {
      const cachedStock = localStorage.getItem('restaurant_menu_stock');
      if (cachedStock) {
        const stockMap = JSON.parse(cachedStock);
        Object.entries(stockMap).forEach(([id, isAvail]) => {
          if (isAvail === false) outOfStockIds.add(String(id));
        });
      }
    } catch {
      // fallback
    }

    // Persist unified out-of-stock blacklist
    saveStoredOutOfStockIds(Array.from(outOfStockIds));

    return DEFAULT_MENU.map(item => ({
      ...item,
      isAvailable: !outOfStockIds.has(String(item.id))
    }));
  });

  // Initialize orders from localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('restaurant_orders');
      if (cached) return JSON.parse(cached);
    } catch {
      // fallback
    }
    return [];
  });

  // Array of active orders placed by this customer (supports multiple simultaneous orders)
  const [customerOrders, setCustomerOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('restaurant_customer_active_orders');
      if (cached) return JSON.parse(cached);
      const singleCached = localStorage.getItem('restaurant_active_customer_order');
      if (singleCached) {
        const parsed = JSON.parse(singleCached);
        return parsed ? [parsed] : [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Backward compatible single active customer order
  const [activeCustomerOrder, setActiveCustomerOrder] = useState(() => {
    return customerOrders[0] || null;
  });

  const [notification, setNotification] = useState(null);
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('restaurant_backend_url') ||
           import.meta.env.VITE_BACKEND_URL ||
           (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001' : '');
  });

  const socketRef = useRef();
  const broadcastChannelRef = useRef();

  // Helper to persist stock state (keeps both map & blacklist in sync)
  const persistStock = (newMenu) => {
    try {
      const stockMap = {};
      const outOfStock = [];
      newMenu.forEach(item => {
        const isAvail = item.isAvailable !== false;
        stockMap[item.id] = isAvail;
        stockMap[String(item.id)] = isAvail;
        if (!isAvail) outOfStock.push(String(item.id));
      });
      localStorage.setItem('restaurant_menu_stock', JSON.stringify(stockMap));
      saveStoredOutOfStockIds(outOfStock);
    } catch {
      // ignore
    }
  };

  // Helper to persist orders
  const persistOrders = (newOrders) => {
    try {
      localStorage.setItem('restaurant_orders', JSON.stringify(newOrders));
    } catch {
      // ignore
    }
  };

  // Helper to persist customer active orders (multi-order support)
  const persistCustomerOrders = (newCustomerOrders) => {
    try {
      localStorage.setItem('restaurant_customer_active_orders', JSON.stringify(newCustomerOrders));
      if (newCustomerOrders.length > 0) {
        localStorage.setItem('restaurant_active_customer_order', JSON.stringify(newCustomerOrders[0]));
      } else {
        localStorage.removeItem('restaurant_active_customer_order');
      }
    } catch {
      // ignore
    }
  };

  // Helper to persist active order (single)
  const persistActiveOrder = (order) => {
    try {
      if (order) {
        localStorage.setItem('restaurant_active_customer_order', JSON.stringify(order));
      } else {
        localStorage.removeItem('restaurant_active_customer_order');
      }
    } catch {
      // ignore
    }
  };

  // 1. Setup BroadcastChannel for 0ms instant tab-to-tab synchronization
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('restaurant_live_portal_sync');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        console.log('[BroadcastChannel Event]', type, payload);

        if (type === 'STOCK_TOGGLED') {
          const targetIdStr = String(payload.itemId);
          const currentOutOfStock = new Set(getStoredOutOfStockIds());
          if (payload.isAvailable) {
            currentOutOfStock.delete(targetIdStr);
          } else {
            currentOutOfStock.add(targetIdStr);
          }
          saveStoredOutOfStockIds(Array.from(currentOutOfStock));

          setMenu(prev => {
            const next = prev.map(item => {
              if (String(item.id) === targetIdStr) {
                return { ...item, isAvailable: payload.isAvailable };
              }
              return item;
            });
            persistStock(next);
            return next;
          });
        } else if (type === 'NEW_ORDER') {
          setOrders(prev => {
            const exists = prev.some(o => o.id === payload.order.id);
            if (exists) return prev;
            const next = [payload.order, ...prev];
            persistOrders(next);
            return next;
          });
          playOrderChime();
          setNotification(`🔔 New Order from Table ${payload.order.tableNumber}!`);
          setTimeout(() => setNotification(null), 4000);
        } else if (type === 'ORDER_UPDATED') {
          setOrders(prev => {
            const next = prev.map(o => o.id === payload.orderId ? { ...o, status: payload.status } : o);
            persistOrders(next);
            return next;
          });
          setCustomerOrders(prev => {
            const next = prev.map(o => o.id === payload.orderId ? { ...o, status: payload.status } : o);
            persistCustomerOrders(next);
            return next;
          });
          setActiveCustomerOrder(prev => {
            if (prev && prev.id === payload.orderId) {
              const updated = { ...prev, status: payload.status };
              persistActiveOrder(updated);
              return updated;
            }
            return prev;
          });
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel not available:', err);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  // 2. Setup WebSocket connection (with Railway backend)
  useEffect(() => {
    const cleanUrl = backendUrl ? backendUrl.replace(/\/$/, '') : null;
    if (!cleanUrl) {
      console.log('[SocketContext] No remote backend URL configured yet. Cross-tab sync active via BroadcastChannel.');
      return;
    }

    console.log('[SocketContext] Connecting to server at:', cleanUrl);
    const s = io(cleanUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
      timeout: 15000
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to backend WebSocket:', s.id);
      setConnected(true);

      // Sync menu stock from server with permanent local overrides
      s.emit('menu:get', (serverMenu) => {
        if (Array.isArray(serverMenu) && serverMenu.length > 0) {
          const outOfStockSet = new Set(getStoredOutOfStockIds());

          // If the server explicitly marked any dish as unavailable, respect it as well
          serverMenu.forEach(sm => {
            if (sm.isAvailable === false) {
              outOfStockSet.add(String(sm.id));
            }
          });

          const consolidatedList = Array.from(outOfStockSet);
          saveStoredOutOfStockIds(consolidatedList);

          setMenu(prev => {
            const next = prev.map(localItem => {
              const isOut = outOfStockSet.has(String(localItem.id));
              return { ...localItem, isAvailable: !isOut };
            });
            persistStock(next);
            return next;
          });

          // Sync our consolidated permanent out-of-stock blacklist back to server
          if (consolidatedList.length > 0) {
            s.emit('menu:sync_all_stock', consolidatedList);
          }
        }
      });

      // Sync orders from server
      s.emit('orders:get', (serverOrders) => {
        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrders(serverOrders);
          persistOrders(serverOrders);
        }
      });
    });

    s.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    s.on('menu:stock_updated', (data) => {
      console.log('[Socket.IO] Stock updated:', data);
      const targetIdStr = String(data.itemId);
      const currentOutOfStock = new Set(getStoredOutOfStockIds());
      if (data.isAvailable) {
        currentOutOfStock.delete(targetIdStr);
      } else {
        currentOutOfStock.add(targetIdStr);
      }
      saveStoredOutOfStockIds(Array.from(currentOutOfStock));

      setMenu(prev => {
        const next = prev.map(item => {
          if (String(item.id) === targetIdStr) {
            return { ...item, isAvailable: data.isAvailable };
          }
          return item;
        });
        persistStock(next);
        return next;
      });
    });

    s.on('menu:batch_stock_updated', (data) => {
      if (Array.isArray(data?.menu)) {
        const outList = data.menu.filter(i => i.isAvailable === false).map(i => String(i.id));
        saveStoredOutOfStockIds(outList);
        const set = new Set(outList);
        setMenu(prev => {
          const next = prev.map(item => ({
            ...item,
            isAvailable: !set.has(String(item.id))
          }));
          persistStock(next);
          return next;
        });
      }
    });

    s.on('order:new', (newOrder) => {
      console.log('[Socket.IO] New order:', newOrder);
      setOrders(prev => {
        const exists = prev.some(o => o.id === newOrder.id);
        if (exists) return prev;
        const next = [newOrder, ...prev];
        persistOrders(next);
        return next;
      });
      playOrderChime();
      setNotification(`🔔 New Order from Table ${newOrder.tableNumber}!`);
      setTimeout(() => setNotification(null), 4000);
    });

    s.on('order:updated', (updatedOrder) => {
      console.log('[Socket.IO] Order updated:', updatedOrder);
      setOrders(prev => {
        const next = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        persistOrders(next);
        return next;
      });
      setCustomerOrders(prev => {
        const next = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        persistCustomerOrders(next);
        return next;
      });
      setActiveCustomerOrder(prev => {
        if (prev && prev.id === updatedOrder.id) {
          persistActiveOrder(updatedOrder);
          return updatedOrder;
        }
        return prev;
      });
    });

    return () => {
      s.disconnect();
    };
  }, [backendUrl]);

  // Action: Toggle Menu Item In/Out of Stock (Permanently stored)
  const toggleStock = useCallback((itemId) => {
    const targetIdStr = String(itemId);
    let updatedAvailability = false;

    setMenu(prev => {
      const currentOutOfStock = new Set(getStoredOutOfStockIds());
      const next = prev.map(item => {
        if (String(item.id) === targetIdStr) {
          updatedAvailability = !item.isAvailable;
          if (updatedAvailability) {
            currentOutOfStock.delete(targetIdStr);
          } else {
            currentOutOfStock.add(targetIdStr);
          }
          return { ...item, isAvailable: updatedAvailability };
        }
        return item;
      });
      saveStoredOutOfStockIds(Array.from(currentOutOfStock));
      persistStock(next);
      return next;
    });

    // 1. Broadcast immediately across tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'STOCK_TOGGLED',
        payload: { itemId: targetIdStr, isAvailable: updatedAvailability }
      });
    }

    // 2. Emit over WebSocket to backend
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('menu:toggle_stock', { itemId: targetIdStr, isAvailable: updatedAvailability });
    } else if (backendUrl) {
      // REST fallback
      fetch(`${backendUrl.replace(/\/$/, '')}/api/menu/toggle-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: targetIdStr, isAvailable: updatedAvailability })
      }).catch(() => {});
    }
  }, [backendUrl]);

  // Action: Place Customer Order
  const placeOrder = useCallback((orderData) => {
    return new Promise((resolve) => {
      const newOrder = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        tableNumber: String(orderData.tableNumber || '1'),
        items: orderData.items || [],
        total: Number(orderData.total) || 0,
        customerNotes: orderData.customerNotes || '',
        status: 'pending', // Starts strictly at Pending
        createdAt: new Date().toISOString()
      };

      // 1. Update customer orders array (supports multiple orders) & local orders
      setCustomerOrders(prev => {
        const next = [newOrder, ...prev.filter(o => o.id !== newOrder.id)];
        persistCustomerOrders(next);
        return next;
      });
      setActiveCustomerOrder(newOrder);
      persistActiveOrder(newOrder);
      setOrders(prev => {
        const next = [newOrder, ...prev];
        persistOrders(next);
        return next;
      });

      // 2. Broadcast immediately to Admin tab
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'NEW_ORDER',
          payload: { order: newOrder }
        });
      }

      // 3. Send to backend server
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('order:create', orderData, (response) => {
          if (response?.order) {
            setCustomerOrders(prev => {
              const next = prev.map(o => (o.id === newOrder.id || o.id === response.order.id) ? response.order : o);
              persistCustomerOrders(next);
              return next;
            });
            setActiveCustomerOrder(response.order);
            persistActiveOrder(response.order);
            resolve(response.order);
            return;
          }
          resolve(newOrder);
        });
      } else if (backendUrl) {
        fetch(`${backendUrl.replace(/\/$/, '')}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })
          .then(res => res.json())
          .then(resOrder => {
            setCustomerOrders(prev => {
              const next = prev.map(o => (o.id === newOrder.id || o.id === resOrder.id) ? resOrder : o);
              persistCustomerOrders(next);
              return next;
            });
            setActiveCustomerOrder(resOrder);
            persistActiveOrder(resOrder);
            resolve(resOrder);
          })
          .catch(() => resolve(newOrder));
      } else {
        resolve(newOrder);
      }
    });
  }, [backendUrl]);

  // Action: Update Order Status (Pending -> Preparing -> Served -> Completed | Cancelled)
  const updateOrderStatus = useCallback((orderId, status) => {
    console.log('[Admin Action] Updating order status:', orderId, status);

    // 1. Update local orders list
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      persistOrders(next);
      return next;
    });

    // 2. Update customer active orders array
    setCustomerOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      persistCustomerOrders(next);
      return next;
    });

    // 3. Update active customer order if matches
    setActiveCustomerOrder(prev => {
      if (prev && prev.id === orderId) {
        const updated = { ...prev, status };
        persistActiveOrder(updated);
        return updated;
      }
      return prev;
    });

    // 4. Broadcast immediately to Customer tab
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'ORDER_UPDATED',
        payload: { orderId, status }
      });
    }

    // 5. Send to backend server
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('order:update_status', { orderId, status });
    } else if (backendUrl) {
      fetch(`${backendUrl.replace(/\/$/, '')}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(() => {});
    }
  }, [backendUrl]);

  // Dismiss a single customer order from active tracking
  const dismissCustomerOrder = useCallback((orderId) => {
    setCustomerOrders(prev => {
      const next = prev.filter(o => o.id !== orderId);
      persistCustomerOrders(next);
      return next;
    });
    setActiveCustomerOrder(prev => {
      if (prev && prev.id === orderId) {
        return null;
      }
      return prev;
    });
  }, []);

  // Clear all customer active orders
  const clearAllCustomerOrders = useCallback(() => {
    setCustomerOrders([]);
    persistCustomerOrders([]);
    setActiveCustomerOrder(null);
  }, []);

  const saveCustomBackendUrl = (url) => {
    const trimmed = (url || '').trim();
    localStorage.setItem('restaurant_backend_url', trimmed);
    setBackendUrl(trimmed);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      backendUrl,
      saveCustomBackendUrl,
      menu,
      orders,
      customerOrders,
      activeCustomerOrder,
      setActiveCustomerOrder,
      dismissCustomerOrder,
      clearAllCustomerOrders,
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
