import { createContext, useState, useEffect, useContext } from 'react';
export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = async (itemId) => {
    setCartItems((prevCart) => {
      const updateCart = { ...prevCart };

      if (updateCart[itemId]) {
        updateCart[itemId] = updateCart[itemId] + 1;
      } else {
        updateCart[itemId] = 1;
      }

      sessionStorage.setItem('cart', JSON.stringify(updateCart));
      return updateCart;
    });
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prevCart) => {
      const updateCart = { ...prevCart };
      if (updateCart[itemId]) {
        if (updateCart[itemId] > 1) {
          updateCart[itemId] = updateCart[itemId] - 1;
        } else {
          delete updateCart[itemId];
        }
      }
      sessionStorage.setItem('cart', JSON.stringify(updateCart));
      return updateCart;
    });
  };

  // 🆕 New function → Completely remove an item from cart
  const removeItemCompletely = async (itemId) => {
    setCartItems((prevCart) => {
      const updateCart = { ...prevCart };
      delete updateCart[itemId]; // delete no matter the quantity
      sessionStorage.setItem('cart', JSON.stringify(updateCart));
      return updateCart;
    });
  };

  const totalCartItems = Object.values(cartItems || {}).reduce(
    (total, qty) => total + qty,
    0
  );

  const ContextValue = {
    addToCart,
    removeFromCart,
    removeItemCompletely, // 👈 expose new function
    totalCartItems,
    cartItems,
  };

  return (
    <CartContext.Provider value={ContextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
