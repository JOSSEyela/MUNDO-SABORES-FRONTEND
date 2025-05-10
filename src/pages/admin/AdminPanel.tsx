import React, { useState } from 'react';
import styles from '../styles/AdminPanel.module.css';
import AdminDashboard from '../admin/Dashboard/AdminDashboard';
import CategoriaPanel from './CategoriaPanel';
import UsuarioPanel from './UsuarioPanel';


const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'recetas' | 'categorias' | 'usuarios'>('recetas');

    return (
        <div className={styles.panelContainer}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'recetas' ? styles.active : ''}`}
                    onClick={() => setActiveTab('recetas')}
                >
                    Recetas
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'categorias' ? styles.active : ''}`}
                    onClick={() => setActiveTab('categorias')}
                >
                    Categorías
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'usuarios' ? styles.active : ''}`}
                    onClick={() => setActiveTab('usuarios')}
                >
                    Usuarios
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'recetas' && <AdminDashboard />}
                {activeTab === 'categorias' && <CategoriaPanel />}
                {activeTab === 'usuarios' && <UsuarioPanel />}
            </div>
        </div>
    );
};

export default AdminPanel;