import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';

const Carrito: React.FC = () => {
    const { items, removeItem, clearCart } = useCart();
    const navigate = useNavigate();

    const calcularTotal = () => {
        return items
            .reduce((acc, item) => acc + (item.producto?.precio || 0) * item.quantity, 0)
            .toFixed(2);
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Tu Carrito</h1>

                    {items.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">Tu carrito está vacío.</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between py-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {item.producto?.nombre || 'Producto sin nombre'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Cantidad: {item.quantity} × ${item.producto?.precio?.toFixed(2) ?? '0.00'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm transition"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Total: ${calcularTotal()}</h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={clearCart}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
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
