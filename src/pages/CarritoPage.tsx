import React from 'react';
import { useCart } from '../context/CartContext';

const CarritoPage: React.FC = () => {
    const { items, removeItem, clearCart } = useCart();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-[#393939] dark:text-white">Mi Carrito</h1>

            {items.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Tu carrito está vacío.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {items.map((item: any) => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow"
                            >
                                <div>
                                    <p className="text-[#393939] dark:text-white font-medium">
                                        {item.producto.nombre}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                                >
                                    🗑 Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={clearCart}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                            Vaciar carrito
                        </button>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Finalizar compra
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CarritoPage;
