import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import styles from './Home.module.css';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <img src={logo} alt="Logo Un Mundo de Sabores" className={styles.logo} />
            <h1 className={styles.title}>Un Mundo de Sabores</h1>
            <p className={styles.subtitle}>
                Descubre, crea y comparte recetas de todo el mundo.
            </p>
            <div className={styles.buttonGroup}>
                <Link to="/login" className={styles.button}>Iniciar Sesión</Link>
                <Link to="/register" className={styles.button}>Registrarse</Link>
            </div>
        </div>
    );
};

export default Home;
