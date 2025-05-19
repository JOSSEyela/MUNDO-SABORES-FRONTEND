import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackground from '../../components/ParticlesBackground';
import { ToastContainer } from '../../components/Toast';


const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState('2');
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

    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
    >

        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 flex items-center justify-center px-6 py-10">
        <ParticlesBackground/>
        <ToastContainer
            toasts={toasts.map((toast, i) => ({
            ...toast,
            onClose: () => setToasts((prev) => prev.filter((_, index) => index !== i)),
            }))}
        />

        <form
            onSubmit={handleRegister}
            className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-2xl border border-gray-200 relative"
        >

            <h2 className="text-4xl font-bold text-center text-orange-600 mb-10">Crear Cuenta</h2>

            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Nombre de usuario</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                placeholder="Ingrese su nombre de usuario"
            />
            </div>

            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Correo electrónico</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                placeholder="Ingrese su correo"
            />
            </div>

            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Contraseña</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
                placeholder="Ingrese su contraseña"
            />
            </div>

            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Rol</label>
            <select
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                required
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            >
                <option value="1">Administrador</option>
                <option value="2">Usuario</option>
            </select>
            </div>

            <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-lg font-semibold rounded-xl transition duration-300"
            >
            Registrarse
            </button>

            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-yellow-600 hover:underline">
                Inicia sesión
                </Link>
            </p>
            <p>
                <Link to="/" className="text-yellow-600 hover:underline">
                Volver al inicio
                </Link>
            </p>
            </div>
        </form>
        </div>

    </motion.div>

  );
};

export default Register;
