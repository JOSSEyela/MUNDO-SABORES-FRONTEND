import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CarritoPage: React.FC = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('/cart');
                setItems(response.data.items);
            } catch (error) {
                console.error('Error al cargar el carrito', error);
            }
        };

        fetchCart();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Mi Carrito</h1>
            {items.length === 0 ? (
                <p className="text-gray-600">Tu carrito está vacío.</p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item: any) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow"
                        >
                            <span>{item.producto.nombre}</span>
                            <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CarritoPage;
