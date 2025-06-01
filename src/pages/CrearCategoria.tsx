import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import Navbar from '../pages/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fondo from '../assets/images/fondo-recetas.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CrearCategoria: React.FC = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [filtro, setFiltro] = useState('');
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nombreEditado, setNombreEditado] = useState('');
    const [categoriaExpandida, setCategoriaExpandida] = useState<number | null>(null);
    const [recetasPorCategoria, setRecetasPorCategoria] = useState<{ [key: number]: any[] }>({});

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
            toast.success('✅ Categoría creada');
            setNuevaCategoria('');
            cargarCategorias();
        } catch (err: any) {
            const msg = err.response?.data?.message || '❌ Error al crear categoría';
            toast.error(msg);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Eliminar esta categoría?')) return;
        try {
            await axios.delete(`/categorias/${id}`);
            toast.success('🗑️ Categoría eliminada');
            cargarCategorias();
        } catch {
            toast.error('❌ Error al eliminar categoría');
        }
    };

    const handleEditar = async (id: number) => {
        try {
            await axios.put(`/categorias/${id}`, { nombre: nombreEditado });
            toast.success('✏️ Categoría actualizada');
            setEditandoId(null);
            setNombreEditado('');
            cargarCategorias();
        } catch {
            toast.error('❌ Error al editar categoría');
        }
    };

    const cargarRecetasPorCategoria = async (categoriaId: number) => {
        try {
            const res = await axios.get(`/categorias/${categoriaId}/recetas`);
            setRecetasPorCategoria(prev => ({ ...prev, [categoriaId]: res.data }));
        } catch {
            toast.error('❌ Error al cargar recetas de la categoría');
        }
    };

    const toggleExpandir = async (id: number) => {
        const yaExpandida = categoriaExpandida === id;
        setCategoriaExpandida(yaExpandida ? null : id);
        if (!yaExpandida && !recetasPorCategoria[id]) {
            await cargarRecetasPorCategoria(id);
        }
    };

    const categoriasFiltradas = categorias
        .filter((cat) => cat.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="relative min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10">
                <div className="absolute inset-0 z-0">
                    <img src={fondo} alt="fondo" className="w-full h-full object-cover opacity-20 blur-sm" />
                </div>

                <div className="relative z-10 p-6 max-w-4xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center text-[#393939] dark:text-white">📁 Gestión de Categorías</h1>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="px-4 py-2 w-1/2 border rounded dark:bg-[#2b2b2b] dark:text-white"
                        />
                        <input
                            type="text"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            placeholder="Nueva categoría"
                            className="px-4 py-2 w-full border rounded dark:bg-[#2b2b2b] dark:text-white"
                        />
                        <button
                            onClick={handleCrear}
                            className="bg-coral hover:bg-[#dd6a4e] text-white px-4 py-2 rounded"
                        >
                            ➕ Crear
                        </button>
                    </div>

                    <ul className="space-y-2">
                        <AnimatePresence>
                            {categoriasFiltradas.map((categoria) => (
                                <motion.li
                                    key={categoria.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    layout
                                    className="bg-gray-50 dark:bg-[#1f1f1f] p-4 rounded shadow-sm border dark:border-gray-700"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleExpandir(categoria.id)}>
                                            <span
                                                className="inline-block w-2 h-2 rounded-full"
                                                style={{ backgroundColor: `hsl(${(categoria.id * 137.5) % 360}, 70%, 75%)` }}
                                            ></span>
                                            {editandoId === categoria.id ? (
                                                <input
                                                    value={nombreEditado}
                                                    onChange={(e) => setNombreEditado(e.target.value)}
                                                    className="px-2 py-1 text-sm rounded dark:bg-[#2b2b2b] dark:text-white"
                                                />
                                            ) : (
                                                <span className="text-[#393939] dark:text-white font-medium">
                                                    {categoria.nombre} (recetas: {categoria.recetaCount ?? 0})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {editandoId === categoria.id ? (
                                                <>
                                                    <button onClick={() => handleEditar(categoria.id)} className="text-green-600 hover:underline text-sm">Guardar</button>
                                                    <button onClick={() => setEditandoId(null)} className="text-gray-500 hover:underline text-sm">Cancelar</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditandoId(categoria.id);
                                                            setNombreEditado(categoria.nombre);
                                                        }}
                                                        className="text-blue-500 hover:underline text-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(categoria.id)}
                                                        className="text-red-500 hover:underline text-sm"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {categoriaExpandida === categoria.id && (
                                        <ul className="mt-3 pl-4 border-l-4 border-coral space-y-2">
                                            {recetasPorCategoria[categoria.id]?.length > 0 ? (
                                                recetasPorCategoria[categoria.id].map((receta: any) => (
                                                    <li key={receta.id}>
                                                        <Link
                                                            to={`/recetas/${receta.id}`}
                                                            className="text-blue-600 dark:text-blue-300 hover:underline"
                                                        >
                                                            {receta.title}
                                                        </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                    No hay recetas en esta categoría.
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default CrearCategoria;
