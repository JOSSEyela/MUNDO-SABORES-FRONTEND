import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import Navbar from '../Navbar';
import styles from '../../styles/CrearReceta.module.css';
import { getCategorias } from '../../api/categorias';
import { useAuth } from '../../context/AuthContext';

const EditarReceta: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [region, setRegion] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recetaRes, categoriasRes] = await Promise.all([
                    axios.get(`/recetas/${id}`),
                    getCategorias()
                ]);

                const receta = recetaRes.data;
                setTitle(receta.title);
                setDescription(receta.description);
                setIngredients(receta.ingredients);
                setInstructions(receta.instructions);
                setRegion(receta.region);
                setCategoriaId(receta.categoria?.id ?? null);
                setCategorias(categoriasRes);
            } catch (err) {
                console.error(err);
                setError('Error al cargar la receta o las categorías');
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!categoriaId) {
            setError('Selecciona una categoría válida');
            return;
        }

        try {
            await axios.put(`/recetas/${id}`, {
                title,
                description,
                ingredients,
                instructions,
                region,
                categoriaId
            });
            alert('Receta actualizada');
            navigate(user?.role === 'admin' ? '/admin' : '/user');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar la receta');
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2 className={styles.title}>Editar Receta</h2>
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>Título:</label>
                <input
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label className={styles.label}>Descripción:</label>
                <textarea
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label className={styles.label}>Ingredientes:</label>
                <textarea
                    className={styles.textarea}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                />

                <label className={styles.label}>Instrucciones:</label>
                <textarea
                    className={styles.textarea}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                />

                <label className={styles.label}>Región:</label>
                <input
                    className={styles.input}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                />

                <label className={styles.label}>Categoría:</label>
                <select
                    className={styles.select}
                    value={categoriaId ?? ''}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit" className={styles.button}>Guardar cambios</button>
            </form>
        </>
    );
};

export default EditarReceta;
