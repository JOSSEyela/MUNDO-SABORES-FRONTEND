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
    latitud?: number;
    longitud?: number;
    imagenUrl?: string;
    promedioCalificacion?: number;
    cantidadCalificaciones?: number;
}

const RecetaCard: React.FC<{
    receta: Receta;
    onEditar: (e: React.MouseEvent, id: number) => void;
    onEliminar: (e: React.MouseEvent, id: number) => void;
    onVerDetalle: (id: number) => void;
}> = ({ receta, onEditar, onEliminar, onVerDetalle }) => {
    const imagenUrl = receta.imagenUrl
        ? `http://localhost:8080${receta.imagenUrl}`
        : '/default.jpg';

    return (
        <div
            onClick={() => onVerDetalle(receta.id)}
            className={`cursor-pointer bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-xl border-l-4 ${
                receta.aprobado ? 'border-green-500' : 'border-yellow-400'
            } transition-transform transform hover:scale-[1.02] duration-200`}
        >
            <img
                src={imagenUrl}
                alt={`Imagen de ${receta.title}`}
                className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-2xl font-semibold text-[#393939] dark:text-white mb-2">
                🍲 {receta.title}
            </h3>
            <div className="flex items-center text-yellow-400 space-x-1 text-sm mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                        {receta.promedioCalificacion! >= i + 1
                            ? '★'
                            : receta.promedioCalificacion! >= i + 0.5
                            ? '⯪'
                            : '☆'}
                    </span>
                ))}
                <span className="text-xs text-gray-600 dark:text-gray-400">
                    ({receta.promedioCalificacion?.toFixed(1) || '0.0'} / {receta.cantidadCalificaciones || 0})
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {receta.description.length > 100
                    ? `${receta.description.slice(0, 100)}...`
                    : receta.description}
            </p>
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                <p>
                    🌍 <strong>Región:</strong> {receta.region?.nombre || 'Sin región'}
                </p>
                {receta.latitud && receta.longitud && (
                    <p className="text-xs text-blue-500 dark:text-blue-400">📍 Ubicación registrada</p>
                )}
                <p>
                    🏷️ <strong>Estado:</strong>{' '}
                    <span className={receta.aprobado ? 'text-green-600 font-semibold' : 'text-yellow-500 font-semibold'}>
                        {receta.aprobado ? '✅ Aprobada' : '⌛ Pendiente'}
                    </span>
                </p>
            </div>
            {!receta.aprobado && (
                <div className="mt-6 flex justify-center gap-6" onClick={(e) => e.stopPropagation()}>
                    <button
                        title="Editar receta"
                        onClick={(e) => onEditar(e, receta.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        title="Eliminar receta"
                        onClick={(e) => onEliminar(e, receta.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

const MisRecetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'todas' | 'aprobadas' | 'pendientes'>('todas');
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

    const handleVerDetalle = (id: number) => navigate(`/recetas/${id}`);

    const handleEditar = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        navigate(`/editar/${id}`);
    };

    const handleEliminar = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const confirm = window.confirm('¿Estás seguro de eliminar esta receta? Esta acción no se puede deshacer.');
        if (!confirm) return;

        try {
            await eliminarReceta(id);
            toast.success('🗑️ Receta eliminada correctamente');
            setRecetas((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('❌ Error al eliminar receta:', err);
            toast.error('Error al eliminar receta');
        }
    };

    const recetasFiltradas = recetas.filter((receta) => {
        const coincideBusqueda = receta.title.toLowerCase().includes(search.toLowerCase());
        const coincideEstado =
            filtroEstado === 'todas' ||
            (filtroEstado === 'aprobadas' && receta.aprobado) ||
            (filtroEstado === 'pendientes' && !receta.aprobado);
        return coincideBusqueda && coincideEstado;
    });

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-12 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-[#393939] dark:text-white">Mis Recetas 🍳</h2>
                    <p className="text-gray-500 mt-2 dark:text-gray-400">Gestiona tus recetas: edición, eliminación y visualización</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por título..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white"
                    />
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value as 'todas' | 'aprobadas' | 'pendientes')}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white"
                    >
                        <option value="todas">Todas</option>
                        <option value="aprobadas">Aprobadas</option>
                        <option value="pendientes">Pendientes</option>
                    </select>
                </div>

                <div className="text-right mb-6">
                    <button
                        onClick={() => navigate('/crear')}
                        className="bg-[#eb8369] hover:bg-[#d3715a] text-white px-5 py-2 rounded-lg shadow-md text-sm font-medium transition transform hover:scale-105"
                    >
                        ➕ Crear nueva receta
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Cargando recetas...</p>
                ) : recetasFiltradas.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No hay recetas que coincidan con la búsqueda o filtro seleccionado.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recetasFiltradas.map((receta) => (
                            <RecetaCard
                                key={receta.id}
                                receta={receta}
                                onEditar={handleEditar}
                                onEliminar={handleEliminar}
                                onVerDetalle={handleVerDetalle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MisRecetas;

