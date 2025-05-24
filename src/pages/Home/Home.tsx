import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecetasAprobadas } from '../../api/recetas';
import logo from '../../assets/images/logo.png';
import FoodParticlesBackground from '../../components/ParticlesBackground';

const Home: React.FC = () => {
    const [recetas, setRecetas] = useState([]);

    useEffect(() => {
        const cargarRecetas = async () => {
            try {
                const data = await getRecetasAprobadas();
                setRecetas(data.slice(0, 6));
            } catch (error) {
                console.error('Error al cargar recetas:', error);
            }
        };
        cargarRecetas();
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-10 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 overflow-hidden">
            {/* Fondo animado */}
            <FoodParticlesBackground />

            {/* Círculos decorativos */}
            <div className="absolute inset-0 z-0">
                <div className="w-[300px] h-[300px] bg-yellow-300 opacity-30 rounded-full absolute top-[-100px] left-[-100px] animate-pulse blur-3xl" />
                <div className="w-[200px] h-[200px] bg-yellow-400 opacity-20 rounded-full absolute bottom-[-60px] right-[-60px] animate-pulse blur-2xl" />
                <div className="w-[150px] h-[150px] bg-yellow-200 opacity-40 rounded-full absolute top-[20%] right-[10%] animate-bounce blur-xl" />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
                <img
                    src={logo}
                    alt="Logo Un Mundo de Sabores"
                    className="w-48 sm:w-60 mb-6 animate-fade-in"
                />

                <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 mb-4">
                    Un Mundo de Sabores
                </h1>

                <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-8">
                    🌍 Descubre, crea y comparte recetas deliciosas de todas partes del mundo. ¡Tu cocina global comienza aquí!
                </p>

                <div className="flex gap-4 flex-wrap justify-center mb-12">
                    <Link
                        to="/login"
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-2 rounded-lg shadow-md text-sm sm:text-base font-medium hover:brightness-110 transition"
                    >
                        🔐 Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white hover:bg-gray-100 text-[#393939] px-6 py-2 rounded-lg shadow-md border border-gray-300 text-sm sm:text-base font-medium"
                    >
                        ✍️ Registrarse
                    </Link>
                </div>

                <section className="w-full">
                    <h2 className="text-2xl font-bold text-orange-600 text-center mb-8">
                        🍴 Recetas Publicadas
                    </h2>

                    {recetas.length === 0 ? (
                        <p className="text-gray-600">No hay recetas disponibles aún.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                            {recetas.map((receta: any) => (
                                <div
                                    key={receta.id}
                                    className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition duration-300"
                                >
                                    <img
                                        src="https://cdn.pixabay.com/photo/2017/05/07/08/56/eat-2294021_960_720.jpg"
                                        alt={receta.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4 space-y-2 text-left">
                                        <h3 className="text-lg font-semibold text-[#393939]">
                                            {receta.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            👤 Autor: {receta.usuario?.username || 'Anónimo'}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {receta.description?.slice(0, 100)}...
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="mt-16 text-xs text-gray-500">
                    © {new Date().getFullYear()} Un Mundo de Sabores. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    );
};

export default Home;
