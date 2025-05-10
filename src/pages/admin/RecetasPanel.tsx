import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecetasNoAprobadas, aprobarReceta, eliminarReceta } from '../../api/adminRecetas';
import { getRecetasAprobadas } from '../../api/recetas';
import styles from '../admin/Dashboard/Dashboard.module.css';

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
        <div>
            {user?.role === 'admin' && (
                <button className={styles.createButton} onClick={() => navigate('/crear')}>
                    ➕ Crear receta directamente
                </button>
            )}

            <h2 className={styles.subtitle}>Recetas pendientes de aprobación</h2>
            {recetasPendientes.length === 0 ? (
                <p>No hay recetas pendientes.</p>
            ) : (
                <div className={styles.recetaGrid}>
                    {recetasPendientes.map((receta: any) => (
                        <div key={receta.id} className={styles.recetaCard}>
                            <h3>{receta.title}</h3>
                            <p><strong>Usuario:</strong> {receta.usuario?.username}</p>
                            <p><strong>Categoría:</strong> {receta.categoria?.nombre}</p>
                            <p>{receta.description?.slice(0, 100)}...</p>
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleAprobar(receta.id)}
                                >
                                    ✅ Aprobar
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleEliminar(receta.id)}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className={styles.subtitle}>Recetas publicadas</h2>
            {recetasAprobadas.length === 0 ? (
                <p>No hay recetas publicadas.</p>
            ) : (
                <div className={styles.recetaGrid}>
                    {recetasAprobadas.map((receta: any) => (
                        <div key={receta.id} className={styles.recetaCard}>
                            <h3>{receta.title}</h3>
                            <p><strong>Usuario:</strong> {receta.usuario?.username}</p>
                            <p><strong>Categoría:</strong> {receta.categoria?.nombre}</p>
                            <p>{receta.description?.slice(0, 100)}...</p>
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => navigate(`/editar/${receta.id}`)}
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleEliminar(receta.id)}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecetasPanel;
