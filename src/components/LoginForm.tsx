import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toasts, setToasts] = useState<{ message: string; type: 'success' | 'error' }[]>([]);
    const navigate = useNavigate();
    const { login } = useAuth();

    const addToast = (message: string, type: 'success' | 'error') => {
        setToasts((prev) => [...prev, { message, type }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password,
            });

            const { access_token } = response.data;
            login(access_token);

            const payload = JSON.parse(atob(access_token.split('.')[1]));
            const userRole = payload.rol;

            addToast('Inicio de sesión exitoso', 'success');

            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'user') {
                navigate('/user');
            } else {
                addToast('Rol no reconocido.', 'error');
            }
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                addToast(err.response.data.message, 'error');
            } else {
                addToast('Credenciales inválidas. Inténtalo de nuevo.', 'error');
            }
        }
    };

    return (
        <>
            <ToastContainer
                toasts={toasts.map((toast, i) => ({
                    ...toast,
                    onClose: () => setToasts((prev) => prev.filter((_, index) => index !== i)),
                }))}
            />

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                 
                <h2 className={styles.title}>Iniciar Sesión</h2>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Ingresar
                </button>
            </form>
        </>
    );
};

export default LoginForm;
