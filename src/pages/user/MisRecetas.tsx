import React, { useEffect, useState } from 'react';
import { getMisRecetas, eliminarReceta } from '../../api/recetas';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Misrecetas.module.css';
import Navbar from '../../pages/Navbar';

interface Receta {
    id: number;
    title: string;
    description: string;
    aprobado: boolean;
    categoria?: { nombre: string };
}

const MisRecetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const navigate = useNavigate();

    const cargarMisRecetas = async () => {
        try {
            const data = await getMisRecetas();
            setRecetas(data);
        } catch (error) {
            console.error('Error al cargar recetas:', error);
        }
    };

    useEffect(() => {
        cargarMisRecetas();
    }, []);

    const handleEditar = (id: number) => navigate(`/editar/${id}`);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                cargarMisRecetas();
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.dashboardContainer}>
                <h1 className={styles.title}>Mis Recetas 🍲</h1>

                {recetas.length === 0 ? (
                    <p>No has creado recetas aún.</p>
                ) : (
                    <div className={styles.recetaGrid}>
                        {recetas.map((receta) => (
                            <div key={receta.id} className={styles.recetaCard}>
                                <h3>{receta.title}</h3>
                                <p><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
                                <p><strong>Aprobada:</strong> {receta.aprobado ? '✅ Sí' : '⏳ No aún'}</p>
                                <p>{receta.description?.slice(0, 100)}...</p>

                                {!receta.aprobado && (
                                    <div className={styles.buttonGroup}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEditar(receta.id)}
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
