import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import styles from '../admin/Dashboard/Dashboard.module.css';
interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: { name: string };
}

const UsuarioPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarUsuarios = async () => {
        try {
            const res = await api.get('/auth'); // Ruta correcta
            if (Array.isArray(res.data)) {
                setUsuarios(res.data);
            } else {
                setError('La respuesta del servidor no es válida.');
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios.');
        }
    };

    const eliminarUsuario = async (id: number) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmar) return;

        try {
            await api.delete(`/auth/${id}`);
            setMensaje('✅ Usuario eliminado correctamente.');
            cargarUsuarios();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError('No se pudo eliminar el usuario.');
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div className={styles.panelContainer}>
            <h2 className={styles.subtitle}>Gestión de Usuarios</h2>

            {error && <p className={styles.error}>{error}</p>}
            {mensaje && <p className={styles.success}>{mensaje}</p>}

            {usuarios.length === 0 && !error ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <ul className={styles.listaSimple}>
                    {usuarios.map((u) => (
                        <li key={u.id} className={styles.listaItem}>
                            👤 <strong>{u.username}</strong> – Rol: {u.rol?.name ?? 'Desconocido'}
                            <button
                                onClick={() => eliminarUsuario(u.id)}
                                className={styles.deleteButton}
                                style={{ marginLeft: '1rem' }}
                            >
                                🗑️ Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsuarioPanel;
