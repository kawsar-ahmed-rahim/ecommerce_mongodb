"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [deliverySlot, setDeliverySlot] = useState("Today, 6:00 PM - 8:00 PM");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedItems = window.localStorage.getItem("society-market-cart");
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch {
        window.localStorage.removeItem("society-market-cart");
      }
    }

    const storedWishlist = window.localStorage.getItem(
      "society-market-wishlist",
    );
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch {
        window.localStorage.removeItem("society-market-wishlist");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("society-market-cart", JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "society-market-wishlist",
        JSON.stringify(wishlist),
      );
    }
  }, [wishlist]);

  const addToCart = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item._id === product._id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId),
    );
  };

  const clearCart = () => setItems([]);
  const clearWishlist = () => setWishlist([]);

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => item._id === product._id);
      if (exists) {
        return currentWishlist.filter((item) => item._id !== product._id);
      }
      return [...currentWishlist, product];
    });
  };

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearWishlist,
        subtotal,
        itemCount,
        wishlist,
        toggleWishlist,
        deliverySlot,
        setDeliverySlot,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
