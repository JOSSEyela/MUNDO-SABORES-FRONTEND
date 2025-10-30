import axios from 'axios';
import { BACKEND_URL } from './axiosConfig';

export interface CartItem {
    id: number;
    quantity: number;
    producto: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
    };
}

export interface CartResponse {
    id: number;
    items: CartItem[];
    creadoEn: string;
    actualizadoEn: string;
}

export const getAuthHeaders = (token?: string) =>
    token ? { Authorization: `Bearer ${token}` } : {};

export const fetchCart = async (token?: string): Promise<CartResponse> => {
    const { data } = await axios.get(`${BACKEND_URL}/cart`, {
        headers: getAuthHeaders(token),
    });
    return data;
};

export const removeCartItem = async (itemId: number, token?: string) => {
    await axios.delete(`${BACKEND_URL}/cart/${itemId}`, {
        headers: getAuthHeaders(token),
    });
};

export const clearCart = async (token?: string) => {
    await axios.delete(`${BACKEND_URL}/cart`, {
        headers: getAuthHeaders(token),
    });
};
