import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecetasNoAprobadas, aprobarReceta, eliminarReceta } from '../../api/adminRecetas';
import { getRecetasAprobadas } from '../../api/recetas';
import '../../styles/AdminPanel.css';

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
        cargarRecetas();
    }, []);

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

    return (
        <div className="admin-panel space-y-8">
            {user?.role === 'admin' && (
                <div className="flex justify-end">
                    <button className="btn-primary" onClick={() => navigate('/crear')}>
                        ➕ Crear nueva receta
                    </button>
                </div>
            )}

            <div>
                <h2 className="admin-title"> Recetas pendientes de aprobación</h2>
                {recetasPendientes.length === 0 ? (
                    <p className="text-[#393939] text-sm">No hay recetas pendientes.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recetasPendientes.map((receta: any) => (
                            <div key={receta.id} className="admin-box">
                                <h3 className="font-bold text-[#393939] text-lg">{receta.title}</h3>
                                <p><strong>Usuario:</strong> {receta.usuario?.username}</p>
                                <p><strong>Categoría:</strong> {receta.categoria?.nombre}</p>
                                <p>{receta.description?.slice(0, 100)}...</p>
                                <div className="flex gap-2 mt-3">
                                    <button className="btn-primary" onClick={() => handleAprobar(receta.id)}>
                                        ✅ Aprobar
                                    </button>
                                    <button className="btn-danger" onClick={() => handleEliminar(receta.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="admin-title"> Recetas publicadas</h2>
                {recetasAprobadas.length === 0 ? (
                    <p className="text-[#393939] text-sm">No hay recetas publicadas.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recetasAprobadas.map((receta: any) => (
                            <div key={receta.id} className="admin-box">
                                <h3 className="font-bold text-[#393939] text-lg">{receta.title}</h3>
                                <p><strong>Usuario:</strong> {receta.usuario?.username}</p>
                                <p><strong>Categoría:</strong> {receta.categoria?.nombre}</p>
                                <p>{receta.description?.slice(0, 100)}...</p>
                                <div className="flex gap-2 mt-3">
                                    <button className="btn-secondary" onClick={() => navigate(`/editar/${receta.id}`)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn-danger" onClick={() => handleEliminar(receta.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecetasPanel;
