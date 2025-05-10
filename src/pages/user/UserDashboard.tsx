import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getRecetasAprobadas,
    getMisRecetas,
    eliminarReceta
} from '../../api/recetas';
import api from '../../api/axiosConfig';
import styles from '../admin/Dashboard/Dashboard.module.css';
import Navbar from '../../pages/Navbar';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [misRecetas, setMisRecetas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');

    const cargarDatos = async () => {
        try {
            const [aprobadas, mias, cats] = await Promise.all([
                getRecetasAprobadas(),
                getMisRecetas(),
                api.get('/categorias'),
            ]);
            setRecetas(aprobadas);
            setMisRecetas(mias);
            setCategorias(cats.data);
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
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>¡Hola, {user?.username}! 👨‍🍳</h1>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/crear')}
                        className={styles.createButton}
                    >
                        ➕ Crear nueva receta
                    </button>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.tabContent}>
                    <h2 className={styles.subtitle}>Recetas aprobadas globales</h2>
                    {recetas.length === 0 ? (
                        <p>No hay recetas disponibles aún.</p>
                    ) : (
                        <div className={styles.recetaGrid}>
                            {recetas.map((receta: any) => (
                                <div key={receta.id} className={styles.recetaCard}>
                                    <h3>{receta.title}</h3>
                                    <p><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
                                    <p>{receta.description?.slice(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className={styles.subtitle}>Mis Recetas</h2>
                    {misRecetas.length === 0 ? (
                        <p>No has creado recetas todavía.</p>
                    ) : (
                        <div className={styles.recetaGrid}>
                            {misRecetas.map((receta: any) => (
                                <div key={receta.id} className={styles.recetaCard}>
                                    <h3>{receta.title}</h3>
                                    <p><strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}</p>
                                    <p><strong>Aprobada:</strong> {receta.aprobado ? '✅ Sí' : '⏳ No aún'}</p>

                                    {!receta.aprobado && (
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
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className={styles.subtitle}>Categorías disponibles</h2>
                    {categorias.length === 0 ? (
                        <p>No hay categorías aún.</p>
                    ) : (
                        <ul className={styles.listaSimple}>
                            {categorias.map((cat: any) => (
                                <li key={cat.id} className={styles.listaItem}>
                                    📁 {cat.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
