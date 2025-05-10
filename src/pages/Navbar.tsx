import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/images/logo.png';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="Logo" className={styles.logoImage} />
                <span className={styles.logoText}>Un Mundo de Sabores</span>
            </div>
            <nav className={styles.nav}>
                {user.role === 'user' && (
                    <>
                        <Link to="/user">Inicio</Link>
                        <Link to="/crear">Crear Receta</Link>
                        <Link to="/mis-recetas">Mis Recetas</Link>
                        
                    </>
                )}
                {user.role === 'admin' && (
                    <>
                        <Link to="/admin">Panel Admin</Link>

                    </>
                )}
                <span className={styles.userInfo}>👤 {user.username}</span>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
