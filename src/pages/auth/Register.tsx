import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';
import { ToastContainer } from '../../components/Toast';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toasts, setToasts] = useState<{ message: string; type: 'success' | 'error' }[]>([]);
    const navigate = useNavigate();

    const addToast = (message: string, type: 'success' | 'error') => {
        setToasts((prev) => [...prev, { message, type }]);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (password.length < 6) {
                addToast('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }

            await axios.post('http://localhost:8080/auth/register', {
                email,
                username,
                password,
            });
            addToast('✅ Registro exitoso. Redirigiendo al login...', 'success');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                addToast(err.response.data.message, 'error');
            } else {
                addToast('Error al registrarse. Verifica los datos.', 'error');
            }
        }
    };

    return (
        <div className={styles.authWrapper}>
            <ToastContainer
                toasts={toasts.map((toast, i) => ({
                    ...toast,
                    onClose: () => setToasts((prev) => prev.filter((_, index) => index !== i)),
                }))}
            />

            <div className={styles.topLink}>
                <Link to="/home" className={styles.backButton}>← Volver al inicio</Link>
            </div>

            <form className={styles.formContainer} onSubmit={handleRegister}>
                <h2 className={styles.title}>Crear cuenta</h2>

                <label className={styles.label}>Nombre:</label>
                <input
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className={styles.label}>Correo:</label>
                <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                />

                <label className={styles.label}>Contraseña:</label>
                <input
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                />

                <button className={styles.button} type="submit">Registrarse</button>
            </form>

            <div className={styles.linkText}>
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
        </div>
    );
};

export default Register;
