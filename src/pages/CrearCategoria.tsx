import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import Navbar from '../pages/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-[#393939] dark:text-white">📁 Gestión de Categorías</h1>

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
                        className="bg-coral text-white px-4 py-2 rounded"
                    >
                        ➕ Crear
                    </button>
                </div>

                <ul className="space-y-2">
                    {categorias.map((categoria: any) => (
                        <li key={categoria.id} className="flex justify-between items-center bg-white dark:bg-[#2c2c2c] p-3 rounded shadow">
                            <span className="text-[#393939] dark:text-white">{categoria.nombre}</span>
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
        </>
    );
};

export default CrearCategoria;
