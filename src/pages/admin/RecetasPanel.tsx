import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getRecetasNoAprobadas,
    aprobarReceta,
    eliminarReceta
} from '../../api/adminRecetas';
import {
    getProductosAprobados,
    getProductosNoAprobados,
    aprobarProducto,
    eliminarProducto
} from '../../api/productos';
import { getRecetasAprobadas } from '../../api/recetas';
import Navbar from '../Navbar';
import fondoRecetas from '../../assets/images/fondo-recetas.jpg';

const RecetasPanel: React.FC = () => {
    const [recetasPendientes, setRecetasPendientes] = useState([]);
    const [recetasAprobadas, setRecetasAprobadas] = useState([]);
    const [productosAprobados, setProductosAprobados] = useState([]);
    const [productosPendientes, setProductosPendientes] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const cargarDatos = async () => {
        try {
            const [pendientes, aprobadas, prodAprobados, prodPendientes] = await Promise.all([
                getRecetasNoAprobadas(),
                getRecetasAprobadas(),
                getProductosAprobados(),
                getProductosNoAprobados()
            ]);
            setRecetasPendientes(pendientes);
            setRecetasAprobadas(aprobadas);
            setProductosAprobados(prodAprobados);
            setProductosPendientes(prodPendientes);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            cargarDatos();
        }
    }, [user]);

    const handleAprobar = async (id: number) => {
        try {
            await aprobarReceta(id);
            cargarDatos();
        } catch (error) {
            alert('Error al aprobar la receta.');
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('⚠️ ¿Eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                cargarDatos();
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    const handleAprobarProducto = async (id: number) => {
        try {
            await aprobarProducto(id);
            cargarDatos();
        } catch (error) {
            alert('Error al aprobar el producto.');
        }
    };

    const handleEliminarProducto = async (id: number) => {
        if (window.confirm('⚠️ ¿Eliminar este producto?')) {
            try {
                await eliminarProducto(id);
                cargarDatos();
            } catch (error) {
                alert('Error al eliminar el producto.');
            }
        }
    };

    if (user?.role !== 'admin') {
        return (
            <>
                <Navbar />
                <div className="text-center text-red-600 font-semibold p-4 dark:text-red-400">
                    🚫 Acceso restringido. Este panel solo está disponible para administradores.
                </div>
            </>
        );
    }

    const renderProductoCard = (producto: any, isPendiente: boolean) => (
        <div
            key={producto.id}
            className="bg-white dark:bg-[#2c2c2c] border-l-4 border-yellow-400 dark:border-yellow-500 rounded-xl shadow-md p-5 space-y-3 hover:shadow-lg transition-all"
        >
            <h3 className="text-xl font-bold text-[#393939] dark:text-white">
                🛍️ {producto.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                👤 <strong>Usuario:</strong> {producto.usuario?.username ?? 'Desconocido'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                🏷️ <strong>Categoría:</strong> {producto.categoria?.nombre ?? 'Sin categoría'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                📝 {producto.description?.slice(0, 100)}...
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                💲 <strong>Precio:</strong> ${producto.price}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                🌍 <strong>Región:</strong> {producto.region?.nombre ?? 'Sin región'}
            </p>

            <div className="flex flex-wrap gap-2 justify-end pt-2">
                {isPendiente ? (
                    <>
                        <button
                            onClick={() => handleAprobarProducto(producto.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            ✅ Aprobar
                        </button>
                        <button
                            onClick={() => handleEliminarProducto(producto.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate(`/editar-producto/${producto.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleEliminarProducto(producto.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
      


    const renderRecetaCard = (receta: any, isPendiente: boolean) => (
        <div key={receta.id} className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 space-y-2 transition-all">
            <h3 className="text-lg font-semibold text-[#393939] dark:text-white">{receta.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Usuario:</strong> {receta.usuario?.username}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{receta.description?.slice(0, 100)}...</p>
            <div className="flex gap-2 pt-2 justify-end">
                {isPendiente ? (
                    <>
                        <button
                            onClick={() => handleAprobar(receta.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            ✅ Aprobar
                        </button>
                        <button
                            onClick={() => handleEliminar(receta.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate(`/editar/${receta.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleEliminar(receta.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-ivory dark:bg-[#1e1e1e] transition-colors">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondoRecetas}
                        alt="fondo recetas"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 p-6 sm:p-10 space-y-12">
                    <div className="flex justify-end">
                        <button
                            className="bg-coral hover:bg-peach text-white px-4 py-2 rounded shadow-sm text-sm transition"
                            onClick={() => navigate('/crear')}
                        >
                            ➕ Crear nueva receta
                        </button>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-[#393939] dark:text-white mb-4">Recetas pendientes de aprobación</h2>
                        {recetasPendientes.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay recetas pendientes.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recetasPendientes.map((receta) => renderRecetaCard(receta, true))}
                            </div>
                        )}
                    </section>

                    <div className="text-center text-[#393939] dark:text-white font-medium">──── Recetas publicadas ────</div>

                    <section>
                        {recetasAprobadas.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay recetas publicadas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recetasAprobadas.map((receta) => renderRecetaCard(receta, false))}
                            </div>
                        )}
                    </section>

                    <div className="text-center text-[#393939] dark:text-white font-medium">──── Productos pendientes ────</div>

                    <section>
                        {productosPendientes.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay productos pendientes.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productosPendientes.map((producto) => renderProductoCard(producto, true))}
                            </div>
                        )}
                    </section>

                    <div className="text-center text-[#393939] dark:text-white font-medium">──── Productos publicados ────</div>

                    <section>
                        {productosAprobados.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay productos publicados.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productosAprobados.map((producto) => renderProductoCard(producto, false))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default RecetasPanel;
