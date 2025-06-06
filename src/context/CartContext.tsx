import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

interface CartItem {
    id: number;
    producto: any;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (productoId: number, quantity: number) => void;
    removeItem: (itemId: number) => void;
    clearCart: () => void;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const refreshCart = async () => {
        try {
            const { data } = await api.get('/cart');
            setItems(data.items || []);
        } catch (error) {
            console.error('Error al cargar carrito:', error);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const addToCart = async (productoId: number, quantity: number) => {
        try {
            await api.post('/cart/add', { productoId, quantity });
            refreshCart();
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/cart/${itemId}`);
            refreshCart();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart');
            refreshCart();
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
        }
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeItem, clearCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
    return context;
};