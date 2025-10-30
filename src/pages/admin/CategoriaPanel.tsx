import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fondo from '../assets/images/fondo-recetas.jpg';

type Categoria = { id: number; nombre: string; createdAt?: string };

const PAGE_SIZE = 10;

const CrearCategoria: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorLoad, setErrorLoad] = useState<string>('');

    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState<'recientes' | 'az' | 'za'>('recientes');

    const [editId, setEditId] = useState<number | null>(null);
    const [editNombre, setEditNombre] = useState('');
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState<{ open: boolean; id?: number; nombre?: string }>({
        open: false,
    });

    const cargarCategorias = async () => {
        setIsLoading(true);
        setErrorLoad('');
        try {
            const res = await axios.get('/categorias');
            setCategorias(res.data ?? []);
        } catch {
            setErrorLoad('❌ Error al cargar las categorías');
            toast.error('❌ Error al cargar las categorías');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    // --- Helpers ---
    const normaliza = (s: string) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    const existeDuplicado = (nombre: string, omitId?: number) => {
        const n = normaliza(nombre);
        return categorias.some((c) => normaliza(c.nombre) === n && c.id !== omitId);
    };

    // --- Crear ---
    const handleCrear = async () => {
        const nombre = nuevaCategoria.trim();
        if (!nombre) return;
        if (existeDuplicado(nombre)) {
            toast.info('⚠️ Ya existe una categoría con ese nombre');
            return;
        }

        try {
            const res = await axios.post('/categorias', { nombre });
            const creada: Categoria = res.data ?? { id: Math.random(), nombre }; // fallback
            setCategorias((prev) => [creada, ...prev]);
            toast.success('✅ Categoría creada correctamente');
            setNuevaCategoria('');
            setPage(1);
        } catch (err: any) {
            const msg = err?.response?.data?.message || '❌ Error al crear la categoría';
            toast.error(msg);
        }
    };

    // --- Editar ---
    const startEdit = (cat: Categoria) => {
        setEditId(cat.id);
        setEditNombre(cat.nombre);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNombre('');
    };

    const saveEdit = async (id: number) => {
        const nombre = editNombre.trim();
        if (!nombre) return;
        if (existeDuplicado(nombre, id)) {
            toast.info('⚠️ Ya existe una categoría con ese nombre');
            return;
        }
        // Optimista
        const prev = [...categorias];
        setCategorias((curr) => curr.map((c) => (c.id === id ? { ...c, nombre } : c)));
        setEditId(null);
        setEditNombre('');

        try {
            // Si tu API no soporta PUT, puedes cambiar a PATCH o ajustar aquí.
            await axios.put(`/categorias/${id}`, { nombre });
            toast.success('✅ Categoría actualizada');
        } catch {
            setCategorias(prev);
            toast.error('❌ Error al actualizar la categoría (se revirtió)');
        }
    };

    // --- Eliminar ---
    const handleEliminar = async (id: number) => {
        const prev = [...categorias];
        setCategorias((curr) => curr.filter((c) => c.id !== id)); // optimista
        setModal({ open: false });

        try {
            await axios.delete(`/categorias/${id}`);
            toast.success('🗑️ Categoría eliminada');
        } catch {
            setCategorias(prev);
            toast.error('❌ Error al eliminar la categoría (se revirtió)');
        }
    };

    // --- Filtrado / Orden / Paginación ---
    const filtradas = useMemo(() => {
        const q = normaliza(busqueda);
        const arr = categorias.filter((c) => normaliza(c.nombre).includes(q));
        arr.sort((a, b) => {
            if (orden === 'az') return a.nombre.localeCompare(b.nombre);
            if (orden === 'za') return b.nombre.localeCompare(a.nombre);
            // recientes (requiere createdAt, si no, mantiene orden actual)
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return db - da;
        });
        return arr;
    }, [categorias, busqueda, orden]);

    const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtradas.slice(start, start + PAGE_SIZE);
    }, [filtradas, page]);

    useEffect(() => {
        setPage(1);
    }, [busqueda, orden]);

    // --- UI ---
    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="relative min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10">
                {/* Fondo */}
                <div className="absolute inset-0 z-0">
                    <img src={fondo} alt="fondo categorias" className="w-full h-full object-cover opacity-20 blur-sm" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h1 className="text-2xl font-bold text-center sm:text-left text-[#393939] dark:text-white">
                            📁 Gestión de Categorías
                        </h1>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {categorias.length} en total
                        </span>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                        <div className="flex gap-2 w-full">
                            <input
                                type="text"
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCrear();
                                }}
                                placeholder="Nueva categoría (Enter para crear)"
                                className="px-4 py-2 border rounded w-full dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                                aria-label="Nueva categoría"
                            />
                            <button
                                onClick={handleCrear}
                                className="bg-coral hover:bg-[#dd6a4e] text-white px-4 py-2 rounded transition"
                                aria-label="Crear categoría"
                            >
                                ➕ Crear
                            </button>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <input
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar..."
                                    className="pl-9 pr-3 py-2 w-full sm:w-56 border rounded dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                                    aria-label="Buscar categoría"
                                />
                                <span className="absolute left-2 top-2.5 text-gray-500">🔎</span>
                            </div>

                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value as any)}
                                className="px-3 py-2 border rounded dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                                aria-label="Ordenar"
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="az">A-Z</option>
                                <option value="za">Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="space-y-3">
                        {isLoading ? (
                            // Skeletons
                            Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse flex justify-between items-center bg-gray-50 dark:bg-[#1e1e1e] p-3 rounded border dark:border-gray-700"
                                >
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            ))
                        ) : errorLoad ? (
                            <div className="text-center">
                                <p className="text-red-600 dark:text-red-400 mb-3">{errorLoad}</p>
                                <button
                                    onClick={cargarCategorias}
                                    className="px-4 py-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : filtradas.length === 0 ? (
                            <div className="text-center italic text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1e1e1e] p-6 rounded border dark:border-gray-700">
                                No hay categorías que coincidan con tu búsqueda.
                            </div>
                        ) : (
                            <>
                                <ul className="space-y-3">
                                    {pageItems.map((categoria) => (
                                        <li
                                            key={categoria.id}
                                            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-[#1e1e1e] p-3 rounded border dark:border-gray-700"
                                        >
                                            {/* Nombre / edición */}
                                            <div className="flex-1">
                                                {editId === categoria.id ? (
                                                    <input
                                                        value={editNombre}
                                                        onChange={(e) => setEditNombre(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveEdit(categoria.id);
                                                            if (e.key === 'Escape') cancelEdit();
                                                        }}
                                                        autoFocus
                                                        className="px-3 py-2 border rounded w-full dark:bg-[#222] dark:text-white dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <span className="text-[#393939] dark:text-white font-medium">{categoria.nombre}</span>
                                                )}
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex gap-2 justify-end">
                                                {editId === categoria.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(categoria.id)}
                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm"
                                                        >
                                                            💾 Guardar
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="border px-3 py-1.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            ✖️ Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(categoria)}
                                                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            onClick={() => setModal({ open: true, id: categoria.id, nombre: categoria.nombre })}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Paginación */}
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Página {page} de {totalPages}
                                    </span>
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        Siguiente →
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Modal de confirmación */}
                {modal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md bg-white dark:bg-[#2c2c2c] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-[#393939] dark:text-white">Eliminar categoría</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                ¿Seguro deseas eliminar “{modal.nombre}”? Esta acción no se puede deshacer.
                            </p>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    onClick={() => setModal({ open: false })}
                                    className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => modal.id && handleEliminar(modal.id)}
                                    className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CrearCategoria;
