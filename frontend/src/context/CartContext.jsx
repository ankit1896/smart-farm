import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Clear cart on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setCart([]);
            localStorage.removeItem("cart");
        }
    }, [isAuthenticated]);

    const addToCart = (product, quantity = 1, weight = '1 Kg') => {
        setCart(prevCart => {
            const cartItemId = `${product.id}-${weight}`;
            const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity, selected: true }
                        : item
                );
            }
            return [...prevCart, { ...product, cartItemId, weight, quantity, selected: true }];
        });
    };

    const toggleSelection = (cartItemId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const removeFromCart = (cartItemId) => {
        setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const updateWeight = (cartItemId, newWeight) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
            if (!existingItem) return prevCart;

            const newCartItemId = `${existingItem.id}-${newWeight}`;
            const itemWithNewWeightAlreadyExists = prevCart.find(item => item.cartItemId === newCartItemId);

            if (itemWithNewWeightAlreadyExists) {
                // If we're changing to a weight that already exists in the cart, merge them
                return prevCart
                    .filter(item => item.cartItemId !== cartItemId)
                    .map(item => 
                        item.cartItemId === newCartItemId 
                        ? { ...item, quantity: item.quantity + existingItem.quantity }
                        : item
                    );
            }

            return prevCart.map(item =>
                item.cartItemId === cartItemId 
                    ? { ...item, weight: newWeight, cartItemId: newCartItemId } 
                    : item
            );
        });
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => 
        item.selected ? total + (item.discount_price || item.price) * item.quantity : total, 0);
    
    // Calculate Total weight (handles '1 Kg', '500 g' etc.)
    const totalWeight = cart.reduce((total, item) => {
        if (!item.selected) return total;
        const weightValue = parseFloat(item.weight); // Extracts number from '1 Kg' or '2 Kg'
        return total + (isNaN(weightValue) ? 0 : weightValue * item.quantity);
    }, 0);

    const cartCount = cart.length;

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            updateWeight,
            toggleSelection,
            clearCart, 
            cartTotal, 
            totalWeight,
            cartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};
