import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import styles from '../styles/CrearReceta.module.css';
import Navbar from '../pages/Navbar';

const CrearCategoria: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!nombre.trim()) {
            setError('El nombre de la categoría es obligatorio');
            return;
        }

        try {
            await axios.post('/categorias', { nombre });
            setMensaje('Categoría creada exitosamente');
            setNombre('');
        } catch (err) {
            setError('Error al crear la categoría');
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2 className={styles.title}>Crear Categoría</h2>

                {error && <p className={styles.error}>{error}</p>}
                {mensaje && <p className={styles.success}>{mensaje}</p>}

                <label className={styles.label}>Nombre de la categoría:</label>
                <input
                    type="text"
                    className={styles.input}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Postres"
                    required
                />

                <button type="submit" className={styles.button}>
                    Crear
                </button>
            </form>
        </>
    );
};

export default CrearCategoria;
