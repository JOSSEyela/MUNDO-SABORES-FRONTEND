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
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../api/axiosConfig';

interface Receta {
    id: number;
    title: string;
    description: string;
    imagenUrl?: string;
    usuario?: { username: string };
    categoria?: { nombre: string };
}

interface Producto {
    id: number;
    name: string;
    description: string;
    price: number;
    usuario?: { username: string };
    categoria?: { nombre: string };
    region?: { nombre: string };
}

const RecetasPanel: React.FC = () => {
    const [recetasPendientes, setRecetasPendientes] = useState<Receta[]>([]);
    const [recetasAprobadas, setRecetasAprobadas] = useState<Receta[]>([]);
    const [productosAprobados, setProductosAprobados] = useState<Producto[]>([]);
    const [productosPendientes, setProductosPendientes] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const cargarDatos = async () => {
        setIsLoading(true);
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
            toast.error('❌ Error al cargar los datos');
            console.error(error);
        } finally {
            setIsLoading(false);
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
            toast.success('✅ Receta aprobada');
            cargarDatos();
        } catch {
            toast.error('❌ Error al aprobar la receta');
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                toast.success('🗑️ Receta eliminada');
                cargarDatos();
            } catch {
                toast.error('❌ Error al eliminar la receta');
            }
        }
    };

    const handleAprobarProducto = async (id: number) => {
        try {
            await aprobarProducto(id);
            toast.success('✅ Producto aprobado');
            cargarDatos();
        } catch {
            toast.error('❌ Error al aprobar el producto');
        }
    };

    const handleEliminarProducto = async (id: number) => {
        if (window.confirm('¿Eliminar este producto?')) {
            try {
                await eliminarProducto(id);
                toast.success('🗑️ Producto eliminado');
                cargarDatos();
            } catch {
                toast.error('❌ Error al eliminar el producto');
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

    const renderRecetaCard = (receta: Receta, isPendiente: boolean) => (
        <div
            key={receta.id}
            className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 space-y-2 transition-all hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/recetas/${receta.id}`)}
        >
            {receta.imagenUrl && (
                <img
                    src={`${BACKEND_URL}${receta.imagenUrl}`}
                    alt={`Imagen de ${receta.title}`}
                    className="w-full h-40 object-cover rounded-md mb-2"
                />
            )}
            <h3 className="text-lg font-semibold text-[#393939] dark:text-white">{receta.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Usuario:</strong> {receta.usuario?.username}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{receta.description?.slice(0, 100)}...</p>
            <div className="flex gap-2 pt-2 justify-end" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => navigate(`/recetas/${receta.id}`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm"
                >
                    👁️ Ver
                </button>
                {isPendiente ? (
                    <>
                        <button
                            onClick={() => handleAprobar(receta.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                            ✅ Aprobar
                        </button>
                        <button
                            onClick={() => handleEliminar(receta.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate(`/editar/${receta.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleEliminar(receta.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    const renderProductoCard = (producto: Producto, isPendiente: boolean) => (
        <div
            key={producto.id}
            className="bg-white dark:bg-[#2c2c2c] border-l-4 border-yellow-400 dark:border-yellow-500 rounded-xl shadow-md p-5 space-y-3 hover:shadow-lg"
        >
            <h3 className="text-xl font-bold text-[#393939] dark:text-white">🛍️ {producto.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Usuario:</strong> {producto.usuario?.username ?? 'Desconocido'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Categoría:</strong> {producto.categoria?.nombre ?? 'Sin categoría'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{producto.description?.slice(0, 100)}...</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Precio:</strong> ${producto.price}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Región:</strong> {producto.region?.nombre ?? 'Sin región'}</p>
            <div className="flex flex-wrap gap-2 justify-end pt-2">
                {isPendiente ? (
                    <>
                        <button
                            onClick={() => handleAprobarProducto(producto.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                            ✅ Aprobar
                        </button>
                        <button
                            onClick={() => handleEliminarProducto(producto.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate(`/editar-producto/${producto.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleEliminarProducto(producto.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
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
            <div className="relative min-h-screen bg-ivory dark:bg-[#1e1e1e]">
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
                            className="bg-coral hover:bg-peach text-white px-4 py-2 rounded shadow-sm text-sm"
                            onClick={() => navigate('/crear')}
                        >
                            ➕ Crear nueva receta
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center text-gray-500 dark:text-gray-300 font-medium">Cargando datos...</div>
                    ) : (
                        <>
                            <section>
                                <h2 className="text-xl font-bold text-[#393939] dark:text-white mb-4">🕒 Recetas pendientes de aprobación</h2>
                                {recetasPendientes.length === 0 ? (
                                    <p className="text-center italic text-gray-500 dark:text-gray-400">No hay recetas pendientes.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recetasPendientes.map((r) => renderRecetaCard(r, true))}
                                    </div>
                                )}
                            </section>

                            <div className="text-center text-[#393939] dark:text-white font-medium">──── ✅ Recetas publicadas ────</div>

                            <section>
                                {recetasAprobadas.length === 0 ? (
                                    <p className="text-center italic text-gray-500 dark:text-gray-400">No hay recetas publicadas.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recetasAprobadas.map((r) => renderRecetaCard(r, false))}
                                    </div>
                                )}
                            </section>

                            <div className="text-center text-[#393939] dark:text-white font-medium">──── 🛒 Productos pendientes ────</div>

                            <section>
                                {productosPendientes.length === 0 ? (
                                    <p className="text-center italic text-gray-500 dark:text-gray-400">No hay productos pendientes.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {productosPendientes.map((p) => renderProductoCard(p, true))}
                                    </div>
                                )}
                            </section>

                            <div className="text-center text-[#393939] dark:text-white font-medium">──── ✅ Productos publicados ────</div>

                            <section>
                                {productosAprobados.length === 0 ? (
                                    <p className="text-center italic text-gray-500 dark:text-gray-400">No hay productos publicados.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {productosAprobados.map((p) => renderProductoCard(p, false))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default RecetasPanel;
