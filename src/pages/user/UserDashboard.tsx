import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getRecetasAprobadas,
    getMisRecetas,
    eliminarReceta
} from '../../api/recetas';
import api from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [misRecetas, setMisRecetas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');

    const cargarDatos = async () => {
        try {
            const [aprobadas, mias, cats] = await Promise.all([
                getRecetasAprobadas(),
                getMisRecetas(),
                api.get('/categorias'),
            ]);
            setRecetas(aprobadas);
            setMisRecetas(mias);
            setCategorias(cats.data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('No se pudieron cargar los datos.');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                await cargarDatos();
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] p-6 sm:p-10">
                <h1 className="text-2xl font-bold text-[#393939] mb-6">¡Hola, {user?.username}! 👨‍🍳</h1>

                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/crear')}
                        className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-5 py-2 rounded-lg shadow-md text-sm font-medium transition duration-300 transform hover:scale-105"
                    >
                        ➕ Crear nueva receta
                    </button>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {/* Recetas globales */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-[#393939] mb-4">Recetas Aprobadas Globales</h2>
                    {recetas.length === 0 ? (
                        <p className="text-gray-600">No hay recetas disponibles aún.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recetas.map((receta: any) => (
                                <div key={receta.id} className="card bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
                                    <figure>
                                        <img
                                            src="https://cdn.pixabay.com/photo/2017/05/07/08/56/eat-2294021_960_720.jpg"
                                            alt="receta"
                                            className="w-full h-40 object-cover"
                                        />
                                    </figure>
                                    <div className="card-body p-4 space-y-2">
                                        <h3 className="card-title text-lg font-semibold text-[#393939]">{receta.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            <strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}
                                        </p>
                                        <p className="text-sm text-gray-700">{receta.description?.slice(0, 100)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Mis recetas */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-[#393939] mb-4">Mis Recetas</h2>
                    {misRecetas.length === 0 ? (
                        <p className="text-gray-600">No has creado recetas todavía.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {misRecetas.map((receta: any) => (
                                <div key={receta.id} className="card bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
                                    <figure>
                                        <img
                                            src="https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_960_720.jpg"
                                            alt="mi receta"
                                            className="w-full h-40 object-cover"
                                        />
                                    </figure>
                                    <div className="card-body p-4 space-y-2">
                                        <h3 className="card-title text-lg font-semibold text-[#393939]">{receta.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            <strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Aprobada:</strong> {receta.aprobado ? '✅ Sí' : '⏳ No aún'}
                                        </p>
                                        {!receta.aprobado && (
                                            <div className="card-actions flex justify-end space-x-2 mt-3">
                                                <button
                                                    onClick={() => navigate(`/editar/${receta.id}`)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition duration-300 transform hover:scale-105"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(receta.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition duration-300 transform hover:scale-105"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Categorías */}
                <section>
                    <h2 className="text-xl font-semibold text-[#393939] mb-4">Categorías disponibles</h2>
                    {categorias.length === 0 ? (
                        <p className="text-gray-600">No hay categorías aún.</p>
                    ) : (
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                            {categorias.map((cat: any) => (
                                <li key={cat.id}>📁 {cat.nombre}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
};

export default UserDashboard;
