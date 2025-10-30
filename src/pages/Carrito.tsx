// src/views/Carrito.tsx (o donde lo ubiques)
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import { BACKEND_URL } from '../api/axiosConfig';

const Carrito: React.FC = () => {
    const { items, removeItem, clearCart, total, loading } = useCart();
    const navigate = useNavigate();

    const money = (n: number = 0) =>
        n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <>
            <Navbar />

            <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Tu Carrito</h1>

                    {loading ? (
                        <p className="text-center text-gray-600 text-lg">Cargando carrito…</p>
                    ) : items.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">Tu carrito está vacío.</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={
                                                    item.producto?.imageUrl
                                                        ? `${BACKEND_URL}${item.producto.imageUrl}`
                                                        : 'https://via.placeholder.com/64x64?text=%20'
                                                }
                                                alt={item.producto?.name || 'Producto'}
                                                className="w-16 h-16 rounded-lg object-cover border"
                                            />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {item.producto?.name || 'Producto sin nombre'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Cantidad: {item.quantity} × ${money(item.producto?.price ?? 0)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            disabled={loading}
                                            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-1 rounded-full text-sm transition"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Total: ${money(total)}
                                </h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={clearCart}
                                        disabled={loading}
                                        className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-4 py-2 rounded-lg"
                                    >
                                        Vaciar carrito
                                    </button>
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                                    >
                                        Finalizar compra
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Carrito;
