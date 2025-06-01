import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getRecetasAprobadas,
    getMisRecetas,
    eliminarReceta
} from '../../api/recetas';
import { getProductosAprobados } from '../../api/productos';
import Navbar from '../../pages/Navbar';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [misRecetas, setMisRecetas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');

    const cargarDatos = async () => {
        try {
            const [aprobadas, mias, aprobados] = await Promise.all([
                getRecetasAprobadas(),
                getMisRecetas(),
                getProductosAprobados()
            ]);
            setRecetas(aprobadas);
            setMisRecetas(mias);
            setProductos(aprobados);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('No se pudieron cargar los datos.');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                await cargarDatos();
            } catch {
                alert('Error al eliminar la receta.');
            }
        }
    };

    const TarjetaReceta = ({ receta, isPropia = false }: { receta: any; isPropia?: boolean }) => (
        <div
            key={receta.id}
            className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden hover:scale-[1.015] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate(`/recetas/${receta.id}`)}
        >
            <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                    src={receta.imagenUrl ? `http://localhost:8080${receta.imagenUrl}` : '/default.jpg'}
                    alt={`Imagen de ${receta.title}`}
                    className="w-full h-full object-cover"
                />
                {!receta.aprobado && isPropia && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow">
                        ⏳ Pendiente
                    </span>
                )}
            </div>
            <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold text-[#393939] dark:text-white">{receta.title}</h3>
                <div className="flex items-center text-yellow-400 space-x-1 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                            {receta.promedioCalificacion >= i + 1
                                ? '★'
                                : receta.promedioCalificacion >= i + 0.5
                                ? '⯪'
                                : '☆'}
                        </span>
                    ))}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({receta.promedioCalificacion?.toFixed(1) || '0.0'} / {receta.cantidadCalificaciones || 0})
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Categoría:</strong> {receta.categoria?.nombre || 'Sin categoría'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">{receta.description?.slice(0, 100)}...</p>
                {isPropia && !receta.aprobado && (
                    <div className="pt-3 flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
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
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2e2e2e] dark:to-[#1a1a1a] transition-colors">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#393939] dark:text-white">
                            ¡Hola, {user?.username}! 👨‍🍳
                        </h1>
                        <button
                            onClick={() => navigate('/crear')}
                            className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-5 py-2 rounded-lg shadow-md text-sm font-medium transition transform hover:scale-105"
                        >
                            ➕ Crear nueva receta
                        </button>
                    </div>

                    {error && <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>}

                    <section className="mb-14">
                        <h2 className="text-xl font-semibold text-[#393939] dark:text-white mb-4">Recetas Aprobadas Globales</h2>
                        {recetas.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay recetas disponibles aún.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recetas.map((receta: any) => (
                                    <TarjetaReceta key={receta.id} receta={receta} />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="mb-14">
                        <h2 className="text-xl font-semibold text-[#393939] dark:text-white mb-4">Mis Recetas</h2>
                        {misRecetas.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No has creado recetas todavía.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {misRecetas.map((receta: any) => (
                                    <TarjetaReceta key={receta.id} receta={receta} isPropia />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#393939] dark:text-white mb-4">Productos Aprobados</h2>
                        {productos.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No hay productos aprobados aún.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productos.map((producto: any) => (
                                    <div key={producto.id} className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 space-y-2">
                                        <h3 className="text-lg font-semibold text-[#393939] dark:text-white">{producto.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Precio:</strong> ${producto.price}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Región:</strong> {producto.region?.nombre ?? 'No especificada'}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-400">{producto.description?.slice(0, 100)}...</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};

export default UserDashboard;
