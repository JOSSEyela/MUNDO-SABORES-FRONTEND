import React from 'react';
import LoginForm from '../../components/LoginForm';
import { Link } from 'react-router-dom';
import './styles/Auth.css'; // Asegúrate que contenga la animación fadeIn

const Login: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">

                {/* Encabezado visual atractivo */}
                <div className="bg-gradient-to-r from-green-600 to-yellow-400 text-white text-center py-6 px-6">
                    <h1 className="text-xl font-bold drop-shadow-md">Bienvenido a Un Mundo de Sabores</h1>
                    <p className="text-sm mt-1">
                        Descubre y comparte recetas del mundo con nuestra comunidad.
                    </p>
                </div>

                {/* Contenido del login */}
                <div className="px-6 py-8">
                    <h2 className="text-center text-green-700 font-semibold text-lg uppercase mb-4">
                        Iniciar Sesión
                    </h2>

                    <div className="bg-yellow-50 p-6 rounded-lg shadow-inner mb-4">
                        <LoginForm />
                    </div>

                    {/* Enlaces adicionales */}
                    <div className="flex justify-between text-sm text-green-800 mb-4">
                        <span>Recordarme</span>
                        <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>

                    {/* Registro y navegación */}
                    <p className="text-center text-sm text-green-800 mt-2">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-semibold hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>

                    <div className="text-center mt-2">
                        <Link
                            to="/home"
                            className="text-sm text-green-700 hover:underline"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
