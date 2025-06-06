import api from './axiosConfig';

export const addToCart = (productoId: number, quantity: number = 1) =>
    api.post('/cart/add', { productoId, quantity });

export const getCart = () => api.get('/cart');

export const removeFromCart = (itemId: number) =>
    api.delete(`/cart/${itemId}`);

export const clearCart = () => api.delete('/cart');