import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fondo from '../assets/images/fondo-recetas.jpg'; // Asegúrate de que la ruta es correcta

const CrearCategoria: React.FC = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    const cargarCategorias = async () => {
        try {
            const res = await axios.get('/categorias');
            setCategorias(res.data);
        } catch {
            toast.error('❌ Error al cargar las categorías');
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleCrear = async () => {
        if (!nuevaCategoria.trim()) return;

        try {
            await axios.post('/categorias', { nombre: nuevaCategoria });
            toast.success('✅ Categoría creada correctamente');
            setNuevaCategoria('');
            cargarCategorias();
        } catch (err: any) {
            const msg = err.response?.data?.message || '❌ Error al crear la categoría';
            toast.error(msg);
        }
    };

    const handleEliminar = async (id: number) => {
        const confirmar = window.confirm('¿Eliminar esta categoría?');
        if (!confirmar) return;

        try {
            await axios.delete(`/categorias/${id}`);
            toast.success('🗑️ Categoría eliminada');
            cargarCategorias();
        } catch {
            toast.error('❌ Error al eliminar la categoría');
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* Fondo decorativo */}
            <div className="relative min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondo}
                        alt="fondo categorias"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                {/* Contenido principal */}
                <div className="relative z-10 max-w-3xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4 text-[#393939] dark:text-white text-center">
                        📁 Gestión de Categorías
                    </h1>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            placeholder="Nueva categoría"
                            className="px-4 py-2 border rounded w-full dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                        />
                        <button
                            onClick={handleCrear}
                            className="bg-coral hover:bg-[#dd6a4e] text-white px-4 py-2 rounded transition"
                        >
                            ➕ Crear
                        </button>
                    </div>

                    <ul className="space-y-3">
                        {categorias.map((categoria: any) => (
                            <li
                                key={categoria.id}
                                className="flex justify-between items-center bg-gray-50 dark:bg-[#1e1e1e] p-3 rounded shadow-sm border dark:border-gray-700"
                            >
                                <span className="text-[#393939] dark:text-white font-medium">{categoria.nombre}</span>
                                <button
                                    onClick={() => handleEliminar(categoria.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    🗑️ Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default CrearCategoria;
