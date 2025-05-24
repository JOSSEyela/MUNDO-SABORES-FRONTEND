import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecetasAprobadas } from '../../api/recetas';
import logo from '../../assets/images/logo.png';
import FoodParticlesBackground from '../../components/ParticlesBackground'; // Importa el fondo

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
        <div className="relative min-h-screen home-gradient dark:home-gradient flex flex-col items-center text-center p-6 transition-colors overflow-hidden">
            {/* Fondo animado de partículas */}
            <FoodParticlesBackground />

            <img
                src={logo}
                alt="Logo Un Mundo de Sabores"
                className="w-32 sm:w-40 mb-6 animate-fade-in relative z-10"
            />

            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#393939] dark:text-white mb-4 title-glow relative z-10">
                Un Mundo de Sabores
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mb-8 relative z-10">
                🌍 Descubre, crea y comparte recetas deliciosas de todas partes del mundo. ¡Tu cocina global comienza aquí!
            </p>

            <div className="flex gap-4 flex-wrap justify-center mb-12 relative z-10">
                <Link
                    to="/login"
                    className="btn-highlight bg-[#eb8369] hover:bg-[#cf6d55] text-white px-6 py-2 rounded-lg shadow-md transition transform text-sm sm:text-base font-medium flex items-center gap-2"
                >
                    🔐 Iniciar Sesión
                </Link>
                <Link
                    to="/register"
                    className="btn-highlight bg-white hover:bg-gray-100 text-[#393939] px-6 py-2 rounded-lg shadow-md border border-gray-300 transition transform text-sm sm:text-base font-medium flex items-center gap-2 dark:bg-[#2c2c2c] dark:text-white dark:hover:bg-[#3a3a3a]"
                >
                    ✍️ Registrarse
                </Link>
            </div>

            {/* Sección dinámica de recetas */}
            <section className="w-full max-w-6xl relative z-10">
                <h2 className="text-2xl font-bold text-[#393939] dark:text-white text-center mb-8">
                    🍴 Recetas Publicadas
                </h2>

                {recetas.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No hay recetas disponibles aún.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {recetas.map((receta: any) => (
                            <div
                                key={receta.id}
                                className="card-receta bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition duration-300"
                            >
                                <img
                                    src="https://cdn.pixabay.com/photo/2017/05/07/08/56/eat-2294021_960_720.jpg"
                                    alt={receta.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 space-y-2 text-left">
                                    <h3 className="text-lg font-semibold text-[#393939] dark:text-white">
                                        {receta.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        👤 Autor: {receta.usuario?.username || 'Anónimo'}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {receta.description?.slice(0, 100)}...
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <footer className="mt-16 text-xs text-gray-500 dark:text-gray-400 relative z-10">
                © {new Date().getFullYear()} Un Mundo de Sabores. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default Home;
