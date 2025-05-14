import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Register.css';
import { ToastContainer } from '../../components/Toast';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rolId, setRolId] = useState('2'); // Default: usuario
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
                rolId: parseInt(rolId)
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
        <div className="register-wrapper">
            <ToastContainer
                toasts={toasts.map((toast, i) => ({
                    ...toast,
                    onClose: () => setToasts((prev) => prev.filter((_, index) => index !== i)),
                }))}
            />

            <div className="register-top-link">
                <Link to="/home" className="register-back-button">← Volver al inicio</Link>
            </div>

            <form className="register-form-container" onSubmit={handleRegister}>
                <h2 className="register-title">Crear cuenta</h2>

                <label className="register-label">Nombre:</label>
                <input
                    className="register-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className="register-label">Correo:</label>
                <input
                    className="register-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                />

                <label className="register-label">Contraseña:</label>
                <input
                    className="register-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                />

                <label className="register-label">Rol:</label>
                <select
                    className="register-input"
                    value={rolId}
                    onChange={(e) => setRolId(e.target.value)}
                    required
                >
                    <option value="1">Administrador</option>
                    <option value="2">Usuario</option>
                </select>

                <button className="register-button" type="submit">Registrarse</button>
            </form>

            <div className="register-link-text">
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
        </div>
    );
};

export default Register;
