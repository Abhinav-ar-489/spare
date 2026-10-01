"use client";

import * as React from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  vatAmount: number;
  shippingFee: number;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "apexauto_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load cart from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  React.useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.product.discount_price || item.product.price || 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  // 5% VAT (Standard)
  const vatAmount = Math.round(subtotal * 0.05 * 100) / 100;

  // Free standard shipping in UAE above AED 500
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 25;

  const total = subtotal + vatAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        vatAmount,
        shippingFee,
        total,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
