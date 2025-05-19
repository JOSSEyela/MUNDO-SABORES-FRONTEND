import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getRecetasNoAprobadas,
    aprobarReceta,
    eliminarReceta
} from '../../api/adminRecetas';
import { getRecetasAprobadas } from '../../api/recetas';
import Navbar from '../Navbar';
import fondoRecetas from '../../assets/images/fondo-recetas.jpg';

const RecetasPanel: React.FC = () => {
    const [recetasPendientes, setRecetasPendientes] = useState([]);
    const [recetasAprobadas, setRecetasAprobadas] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const cargarRecetas = async () => {
        try {
            const [pendientes, aprobadas] = await Promise.all([
                getRecetasNoAprobadas(),
                getRecetasAprobadas()
            ]);
            setRecetasPendientes(pendientes);
            setRecetasAprobadas(aprobadas);
        } catch (error) {
            console.error('Error al cargar recetas:', error);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            cargarRecetas();
        }
    }, [user]);

    const handleAprobar = async (id: number) => {
        try {
            await aprobarReceta(id);
            cargarRecetas();
        } catch (error) {
            alert('Error al aprobar la receta.');
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                cargarRecetas();
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    if (user?.role !== 'admin') {
        return (
            <>
                <Navbar />
                <div className="text-center text-red-600 font-semibold p-4">
                    🚫 Acceso restringido. Este panel solo está disponible para administradores.
                </div>
            </>
        );
    }

    const renderRecetaCard = (receta: any, isPendiente: boolean) => (
        <div key={receta.id} className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-2">
            <h3 className="text-lg font-semibold text-[#393939]">{receta.title}</h3>
            <p className="text-sm text-gray-700"><strong>Usuario:</strong> {receta.usuario?.username}</p>
            <p className="text-sm text-gray-700"><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
            <p className="text-sm text-gray-600">{receta.description?.slice(0, 100)}...</p>
            <div className="flex gap-2 pt-2 justify-end">
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

    return (
        <>
            <Navbar />

            <div className="relative min-h-screen bg-ivory">
                {/* Fondo de imagen difuminado */}
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
                            className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-4 py-2 rounded shadow-sm text-sm"
                            onClick={() => navigate('/crear')}
                        >
                            ➕ Crear nueva receta
                        </button>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-[#393939] mb-4">Recetas pendientes de aprobación</h2>
                        {recetasPendientes.length === 0 ? (
                            <p className="text-gray-600">No hay recetas pendientes.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recetasPendientes.map((receta) => renderRecetaCard(receta, true))}
                            </div>
                        )}
                    </section>

                    <div className="divider divider-dashed text-[#393939] font-medium">Recetas publicadas</div>

                    <section>
                        {recetasAprobadas.length === 0 ? (
                            <p className="text-gray-600">No hay recetas publicadas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recetasAprobadas.map((receta) => renderRecetaCard(receta, false))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default RecetasPanel;
