import { createContext, useState } from 'react';

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (itemId) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemId]) {
        if (updatedCart[itemId] > 1) {
          updatedCart[itemId] -= 1;
        } else {
          delete updatedCart[itemId];
        }
      }
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeItemCompletely = (itemId) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[itemId];
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // ✅ New function to clear the entire cart
  const clearCart = () => {
    setCartItems({});
    sessionStorage.removeItem('cart');
  };

  const totalCartItems = Object.values(cartItems).reduce(
    (total, qty) => total + qty,
    0
  );

  const ContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    clearCart, // ✅ expose this
    totalCartItems,
  };

  return (
    <CartContext.Provider value={ContextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
