// src/api/cart.ts
import api from './axiosConfig';

/**
 * Agrega un producto al carrito del usuario.
 * @param productoId ID del producto
 * @param quantity Cantidad a agregar (por defecto 1)
 */
export const addToCart = (productoId: number, quantity: number = 1) =>
    api.post('/cart/add', { productoId, quantity });

/**
 * Obtiene el carrito del usuario autenticado
 */
export const getCart = () => api.get('/cart');

/**
 * Elimina un ítem específico del carrito
 * @param itemId ID del ítem
 */
export const removeFromCart = (itemId: number) =>
    api.delete(`/cart/${itemId}`);

/**
 * Vacía el carrito completo del usuario
 */
export const clearCart = () => api.delete('/cart');
