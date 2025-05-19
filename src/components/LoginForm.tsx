import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from './ParticlesBackground';

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


    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
    >
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 flex items-center justify-center px-6 py-10">
        
            <div className="absolute inset-0 z-0">
                <div className="w-[300px] h-[300px] bg-yellow-300 opacity-30 rounded-full absolute top-[-100px] left-[-100px] animate-pulse blur-3xl" />
                <div className="w-[200px] h-[200px] bg-yellow-400 opacity-20 rounded-full absolute bottom-[-60px] right-[-60px] animate-pulse blur-2xl" />
                <div className="w-[150px] h-[150px] bg-yellow-200 opacity-40 rounded-full absolute top-[20%] right-[10%] animate-bounce blur-xl" />
            </div>
            <ParticlesBackground />
            <ToastContainer
            toasts={toasts.map((toast, i) => ({
            ...toast,
            onClose: () => setToasts((prev) => prev.filter((_, index) => index !== i)),
            }))}
        />

        <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-xl bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 animate-fadeIn"
        >
            
            <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-orange-600 mb-2">¡Bienvenido!</h2>
            <p className="text-gray-500">Comparte el sabor del mundo con nosotros </p>
            </div>

            <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Nombre de usuario
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">👤</span>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                placeholder="Ej: juan123"
                />
            </div>
            </div>

            <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                Contraseña
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                placeholder="Tu contraseña secreta"
                />
            </div>
            </div>

            <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-lg font-semibold rounded-xl hover:brightness-110 transition duration-300"
            >
            Ingresar
            </button>

            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
                ¿Olvidaste tu contraseña?{' '}
                <Link to="/recuperar" className="text-orange-600 hover:underline">
                Recuperar
                </Link>
            </p>
            <p>
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-orange-600 hover:underline">
                Regístrate aquí
                </Link>
            </p>
            <p>
                <Link to="/" className="text-orange-600 hover:underline">
                Volver al inicio
                </Link>
            </p>
            </div>

        </form>

            

        </div>
        
    </motion.div>
  );
};

export default LoginForm;
