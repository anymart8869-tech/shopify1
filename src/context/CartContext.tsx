import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cartStoreSlug: string | null;
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedSize?: string, selectedColor?: { name: string; hex: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setStoreScope: (storeSlug: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartStoreSlug, setCartStoreSlug] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart when store scope changes
  const setStoreScope = (storeSlug: string) => {
    if (cartStoreSlug !== storeSlug) {
      setCartStoreSlug(storeSlug);
      try {
        const saved = localStorage.getItem(`storenova_cart_${storeSlug}`);
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
    }
  };

  // Sync to local storage
  useEffect(() => {
    if (cartStoreSlug) {
      localStorage.setItem(`storenova_cart_${cartStoreSlug}`, JSON.stringify(items));
    }
  }, [items, cartStoreSlug]);

  const addItem = (
    product: Product,
    quantity: number,
    selectedSize?: string,
    selectedColor?: { name: string; hex: string }
  ) => {
    const itemId = `${product.id}-${selectedSize || 'default'}-${selectedColor?.name || 'default'}`;

    setItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedSize,
          selectedColor
        }
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (cartStoreSlug) {
      localStorage.removeItem(`storenova_cart_${cartStoreSlug}`);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartStoreSlug,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen,
        setStoreScope
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
