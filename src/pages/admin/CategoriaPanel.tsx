import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import styles from '../admin/Dashboard/Dashboard.module.css';

interface Categoria {
    id: number;
    nombre: string;
    recetas?: Receta[]; 
}

interface Receta {
    id: number;
    title: string;
}

const CategoriaPanel: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);

    const cargarCategorias = async () => {
        try {
            const res = await api.get('/categorias'); 
            setCategorias(res.data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    const handleToggleCategoria = (categoriaId: number) => {
        setCategoriaActiva((prev) => (prev === categoriaId ? null : categoriaId));
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <div className={styles.panelContainer}>
            <h2 className={styles.subtitle}>Gestión de Categorías</h2>

            {categorias.length === 0 ? (
                <p>No hay categorías registradas.</p>
            ) : (
                <ul className={styles.listaSimple}>
                    {categorias.map((cat) => (
                        <li key={cat.id} className={styles.listaItem}>
                            <div
                                onClick={() => handleToggleCategoria(cat.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                📁 <strong>{cat.nombre}</strong>
                            </div>

                            {categoriaActiva === cat.id && (
                                <div className={styles.subLista}>
                                    {cat.recetas?.length ? (
                                        <ul>
                                            {cat.recetas.map((receta) => (
                                                <li key={receta.id}>🍽️ {receta.title}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.textoVacio}>No hay recetas en esta categoría.</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoriaPanel;
