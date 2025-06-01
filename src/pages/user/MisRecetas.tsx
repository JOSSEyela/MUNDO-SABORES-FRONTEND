import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisRecetas, eliminarReceta } from '../../api/recetas';
import Navbar from '../Navbar';
import { toast } from 'react-toastify';

interface Region {
    id: number;
    nombre: string;
}

interface Receta {
    id: number;
    title: string;
    description: string;
    aprobado: boolean;
    region: Region;
}

const MisRecetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        cargarRecetas();
    }, []);

    const cargarRecetas = async () => {
        try {
            const data = await getMisRecetas();
            setRecetas(data);
        } catch (err) {
            console.error('❌ Error al cargar recetas del usuario:', err);
            toast.error('Error al obtener tus recetas.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = (id: number) => {
        navigate(`/recetas/${id}`);
    };

    const handleEditar = (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Evita navegar al hacer clic en editar
        navigate(`/editar/${id}`);
    };

    const handleEliminar = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Evita navegar al hacer clic en eliminar
        const confirm = window.confirm('¿Estás seguro de eliminar esta receta? Esta acción no se puede deshacer.');
        if (!confirm) return;

        try {
            await eliminarReceta(id);
            toast.success('🗑️ Receta eliminada correctamente');
            cargarRecetas();
        } catch (err) {
            console.error('❌ Error al eliminar receta:', err);
            toast.error('Error al eliminar receta');
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-12 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-[#393939] dark:text-white">Mis Recetas 🍳</h2>
                    <p className="text-gray-500 mt-2">Gestiona tus recetas: edición, eliminación y visualización</p>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Cargando recetas...</p>
                ) : recetas.length === 0 ? (
                    <p className="text-center text-gray-500">No has creado recetas aún.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recetas.map((receta) => (
                            <div
                                key={receta.id}
                                onClick={() => handleVerDetalle(receta.id)}
                                className={`cursor-pointer bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border-l-4 ${receta.aprobado ? 'border-green-400' : 'border-yellow-400'
                                    } transition-transform transform hover:scale-[1.02] duration-200`}
                            >
                                <h3 className="text-2xl font-semibold text-[#393939] dark:text-white mb-2">
                                    🍲 {receta.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    {receta.description.length > 90
                                        ? receta.description.substring(0, 90) + '...'
                                        : receta.description}
                                </p>
                                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                                    <p>🌍 <strong>Región:</strong> {receta.region?.nombre || 'Sin región'}</p>
                                    <p>
                                        🏷️ <strong>Estado:</strong>{' '}
                                        <span className={receta.aprobado ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                                            {receta.aprobado ? '✅ Aprobada' : '⌛ Pendiente'}
                                        </span>
                                    </p>
                                </div>

                                {!receta.aprobado && (
                                    <div className="mt-6 flex justify-center gap-6">
                                        <button
                                            onClick={(e) => handleEditar(e, receta.id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={(e) => handleEliminar(e, receta.id)}
                                            className="text-red-500 hover:text-red-700 font-medium transition"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MisRecetas;

