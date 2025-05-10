import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReceta } from '../api/recetas';
import { getCategorias } from '../api/categorias';
import styles from '../styles/CrearReceta.module.css';
import Navbar from '../pages/Navbar';
import { useAuth } from '../context/AuthContext';

const CrearReceta: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // 🔍 Obtenemos el rol del usuario

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [region, setRegion] = useState('');
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data);
                if (data.length > 0) setCategoriaId(data[0].id);
            } catch (err) {
                setError('Error al cargar categorías.');
            }
        };
        fetchCategorias();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!categoriaId) {
            setError('Por favor selecciona una categoría válida');
            return;
        }

        const receta = {
            title,
            description,
            ingredients,
            instructions,
            region,
            categoriaId,
        };

        try {
            await crearReceta(receta);

            if (user?.role === 'admin') {
                alert('✅ Receta creada y publicada exitosamente');
                navigate('/admin');
            } else {
                alert('✅ Receta enviada para aprobación del administrador');
                navigate('/user');
            }

        } catch (err: any) {
            console.error(err);
            setError('Error al crear la receta. Verifica los campos.');
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2 className={styles.title}>Crear Receta</h2>

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
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                    required
                >
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit" className={styles.button}>Enviar</button>
            </form>
        </>
    );
};

export default CrearReceta;
