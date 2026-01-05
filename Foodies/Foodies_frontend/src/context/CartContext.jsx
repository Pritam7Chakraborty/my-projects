/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
export const CartContext = createContext(null);

// 2. Create the Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// 3. Create the Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Check for Restaurant Conflict
    if (cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId) {
      if (!window.confirm("Start a new basket? Adding this will clear items from the previous restaurant.")) {
        return;
      }
      setCartItems([{ ...item, quantity: 1 }]);
      return;
    }

    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map((i) => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};