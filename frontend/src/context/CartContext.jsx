import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart on auth change
  const fetchCart = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      try {
        setLoading(true);
        // Check if there are local guest items to sync first
        const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        if (localCart.length > 0) {
          await cartService.syncCart(user.id, localCart);
          localStorage.removeItem('guest_cart');
        }

        const data = await cartService.getCart(user.id);
        if (data.success) {
          setCartItems(data.items || []);
        }
      } catch (err) {
        console.error('Error fetching remote cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart from localStorage
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      setCartItems(localCart);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save guest cart to localStorage
  const saveGuestCart = (items) => {
    setCartItems(items);
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;
    const price = product.discount_price || product.price;

    if (isAuthenticated && user?.id) {
      try {
        const res = await cartService.addToCart({
          user_id: user.id,
          product_id: product.id,
          quantity: qty,
          price,
          product_name: product.name,
          product_image: product.image,
        });

        if (res.success) {
          showToast(`Added ${product.name} to cart`, 'success');
          await fetchCart();
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to add item to cart';
        showToast(msg, 'error');
      }
    } else {
      // Guest cart handling
      const current = [...cartItems];
      const existingIndex = current.findIndex((item) => item.product_id === product.id);

      if (existingIndex > -1) {
        current[existingIndex].quantity += qty;
      } else {
        current.push({
          id: `guest_${Date.now()}_${product.id}`,
          product_id: product.id,
          quantity: qty,
          price,
          product_name: product.name,
          product_image: product.image,
          current_price: price,
          stock: product.stock,
          category: product.category,
        });
      }
      saveGuestCart(current);
      showToast(`Added ${product.name} to cart`, 'success');
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQty) => {
    const qty = parseInt(newQty, 10);

    if (isAuthenticated && user?.id) {
      try {
        if (qty <= 0) {
          await cartService.removeCartItem(itemId);
        } else {
          await cartService.updateCartItem(itemId, qty);
        }
        await fetchCart();
      } catch (error) {
        showToast('Failed to update cart', 'error');
      }
    } else {
      let current = [...cartItems];
      if (qty <= 0) {
        current = current.filter((item) => item.id !== itemId && item.product_id !== itemId);
      } else {
        current = current.map((item) => {
          if (item.id === itemId || item.product_id === itemId) {
            return { ...item, quantity: qty };
          }
          return item;
        });
      }
      saveGuestCart(current);
    }
  };

  // Remove single item
  const removeFromCart = async (itemId) => {
    if (isAuthenticated && user?.id) {
      try {
        await cartService.removeCartItem(itemId);
        showToast('Item removed from cart', 'info');
        await fetchCart();
      } catch (error) {
        showToast('Failed to remove item', 'error');
      }
    } else {
      const filtered = cartItems.filter((item) => item.id !== itemId && item.product_id !== itemId);
      saveGuestCart(filtered);
      showToast('Item removed from cart', 'info');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (isAuthenticated && user?.id) {
      try {
        await cartService.clearCart(user.id);
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing remote cart:', error);
      }
    } else {
      saveGuestCart([]);
    }
  };

  // Computations
  const cartCount = cartItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.current_price || item.price) * (parseInt(item.quantity, 10) || 0)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal: parseFloat(cartSubtotal.toFixed(2)),
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
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
