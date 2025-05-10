import React from 'react';
import LoginForm from '../../components/LoginForm';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    return (
        <div className={styles.authWrapper}>
            {/* Enlace al home */}
            <div className={styles.topLink}>
                <Link to="/home" className={styles.backButton}>← Volver al inicio</Link>
            </div>


            {/* Formulario + enlace a registro */}
            <div className={styles.formContainer}>
                <LoginForm />
                <p className={styles.linkText}>
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
