import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { EXTRAS_LIST } from '../constants';
import { useSocket } from './SocketContext';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { placeOrder: socketPlaceOrder, activeCustomerOrder } = useSocket();
  const [cart, setCart] = useState([]);
  const [extras, setExtras] = useState([]);
  const [selectedTable, setSelectedTable] = useState(4);
  const [orderStatus, setOrderStatus] = useState(() => {
    return activeCustomerOrder?.status || null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(() => {
    return activeCustomerOrder || null;
  });
  const [chefNote, setChefNote] = useState('');

  // Sync strictly with real-time active customer order updates decided by Admin
  useEffect(() => {
    if (activeCustomerOrder) {
      setOrderStatus(activeCustomerOrder.status);
      setPlacedOrder(prev => {
        if (!prev) return activeCustomerOrder;
        return {
          ...prev,
          status: activeCustomerOrder.status,
          table: activeCustomerOrder.tableNumber || prev.table,
          id: activeCustomerOrder.id || prev.id
        };
      });
    }
  }, [activeCustomerOrder]);

  const addToCart = useCallback((item) => {
    if (item.isAvailable === false) {
      alert(`"${item.name}" is currently out of stock and cannot be ordered.`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setExtras([]);
    setChefNote('');
  }, []);

  // Extras management
  const addExtra = useCallback((extra) => {
    setExtras(prev => {
      const existing = prev.find(e => e.id === extra.id);
      if (existing) {
        return prev.map(e => e.id === extra.id ? { ...e, qty: e.qty + 1 } : e);
      }
      return [...prev, { ...extra, qty: 1 }];
    });
  }, []);

  const removeExtra = useCallback((id) => {
    setExtras(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateExtraQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setExtras(prev => prev.filter(e => e.id !== id));
      return;
    }
    setExtras(prev => prev.map(e => e.id === id ? { ...e, qty } : e));
  }, []);

  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const extrasSubtotal = extras.reduce((sum, e) => sum + e.price * e.qty, 0);
  const subtotal = itemsSubtotal + extrasSubtotal;
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + gst + serviceCharge;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const placeOrder = useCallback(async () => {
    if (cart.length === 0 || !selectedTable) return;

    const orderPayload = {
      tableNumber: selectedTable,
      items: [
        ...cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price, id: i.id })),
        ...extras.map(e => ({ name: e.name, quantity: e.qty, price: e.price, id: e.id, isExtra: true }))
      ],
      total: grandTotal,
      customerNotes: chefNote.trim()
    };

    const newOrder = await socketPlaceOrder(orderPayload);

    setPlacedOrder({
      id: newOrder?.id || ('ORD-' + Date.now().toString().slice(-6)),
      status: 'pending', // Strictly Pending until chef takes action
      items: [...cart],
      extras: [...extras],
      table: selectedTable,
      chefNote: chefNote.trim(),
      itemsSubtotal,
      extrasSubtotal,
      subtotal,
      gst,
      serviceCharge,
      grandTotal,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    });

    setOrderStatus('pending'); // Stays Pending until admin accepts
    setIsCartOpen(false);
    setIsTableSelectorOpen(false);
    clearCart();
  }, [cart, extras, selectedTable, chefNote, itemsSubtotal, extrasSubtotal, subtotal, gst, serviceCharge, grandTotal, socketPlaceOrder, clearCart]);

  const resetOrder = useCallback(() => {
    setOrderStatus(null);
    setPlacedOrder(null);
    localStorage.removeItem('restaurant_active_customer_order');
  }, []);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      extras, addExtra, removeExtra, updateExtraQty, EXTRAS_LIST,
      selectedTable, setSelectedTable,
      orderStatus, setOrderStatus,
      isCartOpen, setIsCartOpen,
      isTableSelectorOpen, setIsTableSelectorOpen,
      placedOrder, placeOrder, resetOrder,
      chefNote, setChefNote,
      itemsSubtotal, extrasSubtotal, subtotal, gst, serviceCharge, grandTotal, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
