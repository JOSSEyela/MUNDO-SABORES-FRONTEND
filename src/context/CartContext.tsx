// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

export interface Producto { id: number; name: string; price: number; imageUrl?: string; }
export interface CartItem { id: number; producto: Producto; quantity: number; }

interface CartContextType {
    items: CartItem[]; count: number; total: number; loading: boolean; error: string | null;
    refreshCart: () => Promise<void>;
    addToCart: (productoId: number, quantity?: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading: authLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const count = useMemo(() => items.reduce((a, it) => a + (it.quantity || 0), 0), [items]);
    const total = useMemo(() => items.reduce((a, it) => a + it.quantity * (it.producto?.price ?? 0), 0), [items]);

    const refreshCart = async () => {
        if (!user || authLoading) return;
        setLoading(true); setError(null);
        try {
            console.log('GET URL:', api.getUri({ url: '/cart' })); // 👈 Verifica que sea .../api/cart
            const { data } = await api.get('/cart');               // GET /api/cart
            setItems(Array.isArray(data?.items) ? data.items : []);
        } catch (e: any) {
            console.error('Error al cargar carrito:', e);
            setError(e?.response?.data?.message ?? 'No se pudo cargar el carrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && !authLoading) refreshCart();
        else if (!user && !authLoading) setItems([]);
    }, [user, authLoading]);

    useEffect(() => {
        const handler = () => refreshCart();
        window.addEventListener('cart:updated', handler);
        return () => window.removeEventListener('cart:updated', handler);
    }, []);

    const addToCart = async (productoId: number, quantity: number = 1) => {
        setError(null);
        try {
            // Primero intentamos /cart/add
            try {
                console.log('POST URL (add):', api.getUri({ url: '/cart/add' }));
                await api.post('/cart/add', { productoId, quantity });
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    // Fallback a /cart si tu backend crea aquí
                    console.log('Fallback POST URL:', api.getUri({ url: '/cart' }));
                    await api.post('/cart', { productoId, quantity });
                } else {
                    throw err;
                }
            }
            await refreshCart();
            window.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (e: any) {
            console.error('Error al agregar producto:', e);
            setError(e?.response?.data?.message ?? 'No se pudo agregar el producto');
            throw e;
        }
    };

    const removeItem = async (itemId: number) => {
        setError(null);
        try {
            console.log('DELETE URL (item):', api.getUri({ url: `/cart/${itemId}` }));
            await api.delete(`/cart/${itemId}`); // DELETE /api/cart/:itemId
            await refreshCart();
            window.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (e: any) {
            console.error('Error al eliminar producto del carrito:', e);
            setError(e?.response?.data?.message ?? 'No se pudo eliminar el producto');
            throw e;
        }
    };

    const clearCart = async () => {
        setError(null);
        try {
            console.log('DELETE URL (clear):', api.getUri({ url: '/cart' }));
            await api.delete('/cart'); // DELETE /api/cart
            await refreshCart();
            window.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (e: any) {
            console.error('Error al vaciar el carrito:', e);
            setError(e?.response?.data?.message ?? 'No se pudo vaciar el carrito');
            throw e;
        }
    };

    return (
        <CartContext.Provider value={{ items, count, total, loading, error, refreshCart, addToCart, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
    return ctx;
};
