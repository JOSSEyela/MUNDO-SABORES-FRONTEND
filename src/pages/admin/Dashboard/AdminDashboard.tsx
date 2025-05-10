import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Navbar from '../../Navbar';
import CategoriaPanel from '../CategoriaPanel';
import UsuarioPanel from '../UsuarioPanel';
import RecetaPanel from '../RecetasPanel';
import { useAuth } from '../../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const [tab, setTab] = useState<'recetas' | 'categorias' | 'usuarios'>('recetas');
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Panel de Administración</h1>

                <div className={styles.tabMenu}>
                    <button
                        onClick={() => setTab('recetas')}
                        className={tab === 'recetas' ? styles.active : ''}
                    >
                        Recetas
                    </button>
                    <button
                        onClick={() => setTab('categorias')}
                        className={tab === 'categorias' ? styles.active : ''}
                    >
                        Categorías
                    </button>
                    <button
                        onClick={() => setTab('usuarios')}
                        className={tab === 'usuarios' ? styles.active : ''}
                    >
                        Usuarios
                    </button>

                    {/* ✅ Botones especiales de acción para admin */}
                    {user?.role === 'admin' && (
                        <div className={styles.specialActions}>
                            <button
                                onClick={() => navigate('/crear')}
                                className={styles.specialButton}
                            >
                                ➕ Crear Receta
                            </button>
                            <button
                                onClick={() => navigate('/crear-categoria')}
                                className={styles.specialButton}
                            >
                                🗂️ Crear Categoría
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.tabContent}>
                    {tab === 'recetas' && <RecetaPanel />}
                    {tab === 'categorias' && <CategoriaPanel />}
                    {tab === 'usuarios' && <UsuarioPanel />}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;

