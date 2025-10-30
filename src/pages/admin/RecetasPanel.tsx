import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getRecetasNoAprobadas,
    aprobarReceta,
    eliminarReceta,
} from '../../api/adminRecetas';
import {
    getProductosAprobados,
    getProductosNoAprobados,
    aprobarProducto,
    eliminarProducto,
} from '../../api/productos';
import { getRecetasAprobadas } from '../../api/recetas';
import Navbar from '../Navbar';
import fondoRecetas from '../../assets/images/fondo-recetas.jpg';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../api/axiosConfig';
import MapaGeneral from '../../components/MapaGeneral';
import { useCart } from '../../context/CartContext';

interface Receta {
    id: number;
    title: string;
    description: string;
    imagenUrl?: string;
    latitud?: number;
    longitud?: number;
    usuario?: { username: string };
    categoria?: { nombre: string };
    createdAt?: string;
}

interface Producto {
    id: number;
    name: string;
    description: string;
    price: number;
    usuario?: { username: string };
    categoria?: { nombre: string };
    region?: { nombre: string };
    createdAt?: string;
}

type TabKey = 'recetas' | 'productos';
type Vista = 'grid' | 'list';
type EstadoFiltro = 'todos' | 'pendientes' | 'aprobados';

const PAGE_SIZE = 9;

const RecetasPanel: React.FC = () => {
    const [recetasPendientes, setRecetasPendientes] = useState<Receta[]>([]);
    const [recetasAprobadas, setRecetasAprobadas] = useState<Receta[]>([]);
    const [productosAprobados, setProductosAprobados] = useState<Producto[]>([]);
    const [productosPendientes, setProductosPendientes] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [tab, setTab] = useState<TabKey>('recetas');
    const [vista, setVista] = useState<Vista>('grid');
    const [mostrarMapa, setMostrarMapa] = useState(true);

    const [search, setSearch] = useState('');
    const searchRef = useRef<HTMLInputElement | null>(null);

    const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>('todos');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
    const [filtroRegion, setFiltroRegion] = useState<string>('todas');

    const [orden, setOrden] = useState<'recientes' | 'titulo_asc' | 'titulo_desc' | 'precio_asc' | 'precio_desc'>('recientes');

    const [page, setPage] = useState(1);

    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    const [modal, setModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm?: () => void;
    }>({ open: false, title: '', message: '', confirmText: '' });

    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const cargarDatos = async () => {
        setIsLoading(true);
        try {
            const [pendientes, aprobadas, prodAprobados, prodPendientes] = await Promise.all([
                getRecetasNoAprobadas(),
                getRecetasAprobadas(),
                getProductosAprobados(),
                getProductosNoAprobados(),
            ]);
            setRecetasPendientes(pendientes);
            setRecetasAprobadas(aprobadas);
            setProductosAprobados(prodAprobados);
            setProductosPendientes(prodPendientes);
        } catch (error) {
            toast.error('❌ Error al cargar los datos');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            cargarDatos();
        }
    }, [user]);

    // Reset de selección y paginación al cambiar filtros/tab
    useEffect(() => {
        setCheckedIds([]);
        setPage(1);
    }, [tab, filtroEstado, filtroCategoria, filtroRegion, search, orden, vista]);

    const allRecetas = useMemo(
        () => ({
            aprobadas: recetasAprobadas,
            pendientes: recetasPendientes,
        }),
        [recetasAprobadas, recetasPendientes]
    );

    const allProductos = useMemo(
        () => ({
            aprobados: productosAprobados,
            pendientes: productosPendientes,
        }),
        [productosAprobados, productosPendientes]
    );

    // Fuentes según filtros
    const baseItems = useMemo(() => {
        if (tab === 'recetas') {
            if (filtroEstado === 'aprobados') return allRecetas.aprobadas;
            if (filtroEstado === 'pendientes') return allRecetas.pendientes;
            return [...allRecetas.pendientes, ...allRecetas.aprobadas];
        } else {
            if (filtroEstado === 'aprobados') return allProductos.aprobados;
            if (filtroEstado === 'pendientes') return allProductos.pendientes;
            return [...allProductos.pendientes, ...allProductos.aprobados];
        }
    }, [tab, filtroEstado, allRecetas, allProductos]);

    // Derivar categorías y regiones para filtros (desde datos)
    const categoriasDisponibles = useMemo(() => {
        if (tab === 'recetas') {
            const setCat = new Set<string>();
            [...recetasAprobadas, ...recetasPendientes].forEach(r => r.categoria?.nombre && setCat.add(r.categoria.nombre));
            return Array.from(setCat);
        } else {
            const setCat = new Set<string>();
            [...productosAprobados, ...productosPendientes].forEach(p => p.categoria?.nombre && setCat.add(p.categoria.nombre));
            return Array.from(setCat);
        }
    }, [tab, recetasAprobadas, recetasPendientes, productosAprobados, productosPendientes]);

    const regionesDisponibles = useMemo(() => {
        if (tab === 'productos') {
            const setReg = new Set<string>();
            [...productosAprobados, ...productosPendientes].forEach(p => p.region?.nombre && setReg.add(p.region.nombre));
            return Array.from(setReg);
        }
        // Para recetas, usamos región del mapa — si no tienes región en receta, ocultaremos filtro
        return [] as string[];
    }, [tab, productosAprobados, productosPendientes]);

    // Filtro + búsqueda + orden
    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();

        const bySearch = (item: any) => {
            if (!q) return true;
            if (tab === 'recetas') {
                const r = item as Receta;
                return (
                    r.title?.toLowerCase().includes(q) ||
                    r.description?.toLowerCase().includes(q) ||
                    r.usuario?.username?.toLowerCase().includes(q) ||
                    r.categoria?.nombre?.toLowerCase().includes(q)
                );
            } else {
                const p = item as Producto;
                return (
                    p.name?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.usuario?.username?.toLowerCase().includes(q) ||
                    p.categoria?.nombre?.toLowerCase().includes(q) ||
                    p.region?.nombre?.toLowerCase().includes(q)
                );
            }
        };

        const byCat = (item: any) => {
            if (filtroCategoria === 'todas') return true;
            const cat = tab === 'recetas' ? (item as Receta).categoria?.nombre : (item as Producto).categoria?.nombre;
            return cat === filtroCategoria;
        };

        const byReg = (item: any) => {
            if (tab === 'recetas') return true;
            if (filtroRegion === 'todas') return true;
            return (item as Producto).region?.nombre === filtroRegion;
        };

        const arr = baseItems.filter(bySearch).filter(byCat).filter(byReg);

        const byOrden = (a: any, b: any) => {
            if (orden === 'recientes') {
                const da = new Date((a.createdAt ?? 0) as any).getTime();
                const db = new Date((b.createdAt ?? 0) as any).getTime();
                return db - da;
            }
            if (tab === 'recetas') {
                const ta = (a as Receta).title?.toLowerCase() ?? '';
                const tb = (b as Receta).title?.toLowerCase() ?? '';
                if (orden === 'titulo_asc') return ta.localeCompare(tb);
                if (orden === 'titulo_desc') return tb.localeCompare(ta);
            } else {
                const pa = (a as Producto).price ?? 0;
                const pb = (b as Producto).price ?? 0;
                if (orden === 'precio_asc') return pa - pb;
                if (orden === 'precio_desc') return pb - pa;
                const na = (a as Producto).name?.toLowerCase() ?? '';
                const nb = (b as Producto).name?.toLowerCase() ?? '';
                if (orden === 'titulo_asc') return na.localeCompare(nb);
                if (orden === 'titulo_desc') return nb.localeCompare(na);
            }
            return 0;
        };

        return arr.sort(byOrden);
    }, [search, baseItems, filtroCategoria, filtroRegion, orden, tab]);

    // Paginación
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredItems.slice(start, start + PAGE_SIZE);
    }, [filteredItems, page]);

    // Utils
    const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

    const openConfirm = (title: string, message: string, confirmText: string, onConfirm: () => void) => {
        setModal({ open: true, title, message, confirmText, onConfirm });
    };

    const closeConfirm = () => setModal({ open: false, title: '', message: '', confirmText: '' });

    // Handlers con Optimistic UI
    const optimistUpdate = <T extends { id: number }>(
        arr: T[],
        setArr: React.Dispatch<React.SetStateAction<T[]>>,
        id: number,
        type: 'remove'
    ) => {
        const prev = [...arr];
        setArr(curr => curr.filter(el => el.id !== id));
        return () => setArr(prev); // rollback
    };

    const handleAprobar = async (id: number) => {
        const rollback = optimistUpdate(recetasPendientes, setRecetasPendientes, id, 'remove');
        try {
            await aprobarReceta(id);
            // Insertar a aprobadas (idealmente el backend devuelve el objeto; aquí clonamos mínimo)
            const aprobado = recetasPendientes.find(r => r.id === id);
            if (aprobado) setRecetasAprobadas(prev => [aprobado, ...prev]);
            toast.success('✅ Receta aprobada');
        } catch {
            rollback();
            toast.error('❌ Error al aprobar la receta');
        }
    };

    const handleEliminar = async (id: number) => {
        const fromPend = recetasPendientes.some(r => r.id === id);
        const fromApr = recetasAprobadas.some(r => r.id === id);
        const rollbackPend = fromPend ? optimistUpdate(recetasPendientes, setRecetasPendientes, id, 'remove') : null;
        const rollbackApr = fromApr ? optimistUpdate(recetasAprobadas, setRecetasAprobadas, id, 'remove') : null;
        try {
            await eliminarReceta(id);
            toast.success('🗑️ Receta eliminada');
        } catch {
            rollbackPend?.();
            rollbackApr?.();
            toast.error('❌ Error al eliminar la receta');
        }
    };

    const handleAprobarProducto = async (id: number) => {
        const rollback = optimistUpdate(productosPendientes, setProductosPendientes, id, 'remove');
        try {
            await aprobarProducto(id);
            const aprobado = productosPendientes.find(p => p.id === id);
            if (aprobado) setProductosAprobados(prev => [aprobado, ...prev]);
            toast.success('✅ Producto aprobado');
        } catch {
            rollback();
            toast.error('❌ Error al aprobar el producto');
        }
    };

    const handleEliminarProducto = async (id: number) => {
        const fromPend = productosPendientes.some(p => p.id === id);
        const fromApr = productosAprobados.some(p => p.id === id);
        const rollbackPend = fromPend ? optimistUpdate(productosPendientes, setProductosPendientes, id, 'remove') : null;
        const rollbackApr = fromApr ? optimistUpdate(productosAprobados, setProductosAprobados, id, 'remove') : null;
        try {
            await eliminarProducto(id);
            toast.success('🗑️ Producto eliminado');
        } catch {
            rollbackPend?.();
            rollbackApr?.();
            toast.error('❌ Error al eliminar el producto');
        }
    };

    // Bulk
    const bulkApprove = async () => {
        const ids = [...checkedIds];
        setCheckedIds([]);
        let ok = 0, fail = 0;
        for (const id of ids) {
            try {
                if (tab === 'recetas') {
                    await handleAprobar(id);
                } else {
                    await handleAprobarProducto(id);
                }
                ok++;
            } catch {
                fail++;
            }
        }
        toast.info(`Proceso masivo: ${ok} ok · ${fail} errores`);
    };

    const bulkDelete = async () => {
        const ids = [...checkedIds];
        setCheckedIds([]);
        let ok = 0, fail = 0;
        for (const id of ids) {
            try {
                if (tab === 'recetas') {
                    await handleEliminar(id);
                } else {
                    await handleEliminarProducto(id);
                }
                ok++;
            } catch {
                fail++;
            }
        }
        toast.info(`Eliminación masiva: ${ok} ok · ${fail} errores`);
    };

    const toggleCheck = (id: number) => {
        setCheckedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    const toggleCheckAllPage = () => {
        const idsInPage = pageItems.map((i: any) => i.id);
        const allSelected = idsInPage.every(id => checkedIds.includes(id));
        if (allSelected) {
            setCheckedIds(prev => prev.filter(id => !idsInPage.includes(id)));
        } else {
            setCheckedIds(prev => Array.from(new Set([...prev, ...idsInPage])));
        }
    };

    if (user?.role !== 'admin') {
        return (
            <>
                <Navbar />
                <div className="text-center text-red-600 font-semibold p-4 dark:text-red-400">
                    🚫 Acceso restringido. Este panel solo está disponible para administradores.
                </div>
            </>
        );
    }

    // Render cards
    const RecetaCard = (receta: Receta, isPendiente: boolean) => (
        <div
            key={receta.id}
            className="group relative bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
        >
            <div className="absolute top-2 left-2 z-10">
                <input
                    type="checkbox"
                    aria-label="Seleccionar"
                    checked={checkedIds.includes(receta.id)}
                    onChange={() => toggleCheck(receta.id)}
                    className="h-4 w-4"
                    onClick={e => e.stopPropagation()}
                />
            </div>
            {receta.imagenUrl && (
                <img
                    src={`${BACKEND_URL}${receta.imagenUrl}`}
                    alt={`Imagen de ${receta.title}`}
                    className="w-full h-40 object-cover"
                    onClick={() => navigate(`/recetas/${receta.id}`)}
                />
            )}
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <h3
                        className="text-lg font-semibold text-[#393939] dark:text-white line-clamp-1 cursor-pointer"
                        onClick={() => navigate(`/recetas/${receta.id}`)}
                        title={receta.title}
                    >
                        {receta.title}
                    </h3>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${isPendiente ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}
                    >
                        {isPendiente ? 'Pendiente' : 'Aprobada'}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    👤 {receta.usuario?.username ?? 'Anónimo'} · 🏷️ {receta.categoria?.nombre ?? 'Sin categoría'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{receta.description}</p>
                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        onClick={() => navigate(`/recetas/${receta.id}`)}
                        className="btn btn-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded"
                    >
                        👁️ Ver
                    </button>
                    {isPendiente ? (
                        <>
                            <button onClick={() => handleAprobar(receta.id)} className="btn btn-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded">✅ Aprobar</button>
                            <button
                                onClick={() =>
                                    openConfirm(
                                        'Eliminar receta',
                                        `¿Seguro deseas eliminar “${receta.title}”?`,
                                        'Eliminar',
                                        () => {
                                            closeConfirm();
                                            handleEliminar(receta.id);
                                        }
                                    )
                                }
                                className="btn btn-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
                            >
                                🗑️ Eliminar
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate(`/editar/${receta.id}`)} className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded">✏️ Editar</button>
                            <button
                                onClick={() =>
                                    openConfirm(
                                        'Eliminar receta',
                                        `¿Eliminar “${receta.title}”? Esta acción no se puede deshacer.`,
                                        'Eliminar',
                                        () => {
                                            closeConfirm();
                                            handleEliminar(receta.id);
                                        }
                                    )
                                }
                                className="btn btn-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
                            >
                                🗑️ Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const ProductoCard = (producto: Producto, isPendiente: boolean) => (
        <div
            key={producto.id}
            className="group relative bg-white dark:bg-[#2c2c2c] border-l-4 border-yellow-400 dark:border-yellow-500 rounded-xl shadow-md p-5 hover:shadow-lg transition"
        >
            <div className="absolute top-3 left-3">
                <input
                    type="checkbox"
                    aria-label="Seleccionar"
                    checked={checkedIds.includes(producto.id)}
                    onChange={() => toggleCheck(producto.id)}
                    className="h-4 w-4"
                />
            </div>
            <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#393939] dark:text-white line-clamp-1">🛍️ {producto.name}</h3>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${isPendiente ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            }`}
                    >
                        {isPendiente ? 'Pendiente' : 'Publicado'}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    👤 {producto.usuario?.username ?? 'Desconocido'} · 🏷️ {producto.categoria?.nombre ?? 'Sin categoría'} · 🌍 {producto.region?.nombre ?? 'Sin región'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{producto.description}</p>
                <p className="text-sm text-gray-900 dark:text-gray-100"><strong>Precio:</strong> {fmt.format(producto.price ?? 0)}</p>
                <div className="flex flex-wrap gap-2 justify-end pt-1">
                    {isPendiente ? (
                        <>
                            <button onClick={() => handleAprobarProducto(producto.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm">✅ Aprobar</button>
                            <button
                                onClick={() =>
                                    openConfirm(
                                        'Eliminar producto',
                                        `¿Eliminar “${producto.name}”?`,
                                        'Eliminar',
                                        () => {
                                            closeConfirm();
                                            handleEliminarProducto(producto.id);
                                        }
                                    )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
                            >
                                🗑️ Eliminar
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate(`/editar-producto/${producto.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">✏️ Editar</button>
                            <button
                                onClick={() =>
                                    openConfirm(
                                        'Eliminar producto',
                                        `¿Eliminar “${producto.name}”? Esta acción no se puede deshacer.`,
                                        'Eliminar',
                                        () => {
                                            closeConfirm();
                                            handleEliminarProducto(producto.id);
                                        }
                                    )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
                            >
                                🗑️ Eliminar
                            </button>
                            <button onClick={() => addToCart(producto.id, 1)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm">🛒 Agregar al carrito</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // Skeletons
    const Skeleton = () => (
        <div className="animate-pulse bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
    );

    // Grid/List wrapper
    const GridOrList: React.FC<{ children: React.ReactNode }> = ({ children }) =>
        vista === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
        ) : (
            <div className="space-y-4">{children}</div>
        );

    // Estado actual para saber si un item está pendiente
    const isRecetaPendiente = (id: number) => recetasPendientes.some(r => r.id === id);
    const isProductoPendiente = (id: number) => productosPendientes.some(p => p.id === id);

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-ivory dark:bg-[#1e1e1e]">
                <div className="absolute inset-0 z-0">
                    <img src={fondoRecetas} alt="fondo recetas" className="w-full h-full object-cover opacity-20 blur-sm" />
                </div>

                <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#393939] dark:text-white">Panel de moderación</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Aprueba, edita o elimina contenido de forma rápida.</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className={`px-3 py-2 rounded-md text-sm ${tab === 'recetas' ? 'bg-coral text-white' : 'bg-white dark:bg-[#2c2c2c] border'}`}
                                onClick={() => setTab('recetas')}
                            >
                                🍲 Recetas
                            </button>
                            <button
                                className={`px-3 py-2 rounded-md text-sm ${tab === 'productos' ? 'bg-coral text-white' : 'bg-white dark:bg-[#2c2c2c] border'}`}
                                onClick={() => setTab('productos')}
                            >
                                🛒 Productos
                            </button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-2">
                                <button
                                    className="bg-coral hover:bg-peach text-white px-4 py-2 rounded shadow-sm text-sm"
                                    onClick={() => navigate('/crear')}
                                >
                                    ➕ Crear nueva receta
                                </button>
                                {tab === 'recetas' && (
                                    <button
                                        className={`px-4 py-2 rounded text-sm ${mostrarMapa ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                                        onClick={() => setMostrarMapa(v => !v)}
                                    >
                                        🌍 {mostrarMapa ? 'Ocultar mapa' : 'Mostrar mapa'}
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <input
                                        ref={searchRef}
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder={`Buscar ${tab === 'recetas' ? 'receta' : 'producto'}...`}
                                        className="pl-9 pr-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                                    />
                                    <span className="absolute left-2 top-2.5 text-gray-500">🔎</span>
                                </div>

                                <select
                                    value={filtroEstado}
                                    onChange={e => setFiltroEstado(e.target.value as EstadoFiltro)}
                                    className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="pendientes">Pendientes</option>
                                    <option value="aprobados">Aprobados</option>
                                </select>

                                <select
                                    value={filtroCategoria}
                                    onChange={e => setFiltroCategoria(e.target.value)}
                                    className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="todas">Todas las categorías</option>
                                    {categoriasDisponibles.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                {tab === 'productos' && (
                                    <select
                                        value={filtroRegion}
                                        onChange={e => setFiltroRegion(e.target.value)}
                                        className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="todas">Todas las regiones</option>
                                        {regionesDisponibles.map(reg => (
                                            <option key={reg} value={reg}>{reg}</option>
                                        ))}
                                    </select>
                                )}

                                <select
                                    value={orden}
                                    onChange={e => setOrden(e.target.value as any)}
                                    className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="recientes">Más recientes</option>
                                    <option value="titulo_asc">Título (A-Z)</option>
                                    <option value="titulo_desc">Título (Z-A)</option>
                                    {tab === 'productos' && (
                                        <>
                                            <option value="precio_asc">Precio (menor a mayor)</option>
                                            <option value="precio_desc">Precio (mayor a menor)</option>
                                        </>
                                    )}
                                </select>

                                <div className="flex items-center gap-1">
                                    <button
                                        className={`px-3 py-2 rounded-md border ${vista === 'grid' ? 'bg-gray-900 text-white' : ''}`}
                                        title="Vista de tarjetas"
                                        onClick={() => setVista('grid')}
                                    >
                                        ⬛⬛
                                    </button>
                                    <button
                                        className={`px-3 py-2 rounded-md border ${vista === 'list' ? 'bg-gray-900 text-white' : ''}`}
                                        title="Vista en lista"
                                        onClick={() => setVista('list')}
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk actions */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {checkedIds.length > 0 ? `${checkedIds.length} seleccionados` : 'Sin selección'}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 text-sm disabled:opacity-50"
                                    disabled={pageItems.length === 0}
                                    onClick={toggleCheckAllPage}
                                >
                                    {pageItems.every((i: any) => checkedIds.includes(i.id)) ? 'Quitar selección (página)' : 'Seleccionar (página)'}
                                </button>
                                <button
                                    className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                                    disabled={checkedIds.length === 0}
                                    onClick={() => openConfirm('Aprobar seleccionados', 'Se aprobarán todos los elementos seleccionados.', 'Aprobar', () => { closeConfirm(); bulkApprove(); })}
                                >
                                    ✅ Aprobar
                                </button>
                                <button
                                    className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
                                    disabled={checkedIds.length === 0}
                                    onClick={() => openConfirm('Eliminar seleccionados', 'Esta acción no se puede deshacer.', 'Eliminar', () => { closeConfirm(); bulkDelete(); })}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mapa */}
                    {tab === 'recetas' && mostrarMapa && recetasAprobadas.some(r => r.latitud && r.longitud) && (
                        <div className="mb-2 bg-white dark:bg-[#2c2c2c] shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-[#393939] dark:text-white mb-4">🌍 Mapa de recetas aprobadas</h2>
                            <MapaGeneral
                                recetas={recetasAprobadas
                                    .filter(r => r.latitud && r.longitud)
                                    .map(r => ({ id: r.id, title: r.title, latitud: r.latitud!, longitud: r.longitud! }))}
                            />
                        </div>
                    )}

                    {/* Contenido */}
                    {isLoading ? (
                        <GridOrList>
                            {Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton key={i} />)}
                        </GridOrList>
                    ) : (
                        <>
                            {filteredItems.length === 0 ? (
                                <div className="text-center italic text-gray-500 dark:text-gray-400 bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl p-10">
                                    No se encontraron resultados con los filtros actuales.
                                </div>
                            ) : (
                                <>
                                    <GridOrList>
                                        {tab === 'recetas'
                                            ? pageItems.map((r: any) => RecetaCard(r, isRecetaPendiente(r.id)))
                                            : pageItems.map((p: any) => ProductoCard(p, isProductoPendiente(p.id)))}
                                    </GridOrList>

                                    {/* Paginación */}
                                    <div className="flex items-center justify-center gap-2 pt-6">
                                        <button
                                            disabled={page <= 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            ← Anterior
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Página {page} de {totalPages}
                                        </span>
                                        <button
                                            disabled={page >= totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Modal de confirmación */}
                    {modal.open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="w-full max-w-md bg-white dark:bg-[#2c2c2c] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-[#393939] dark:text-white">{modal.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{modal.message}</p>
                                <div className="mt-5 flex justify-end gap-2">
                                    <button onClick={closeConfirm} className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800">Cancelar</button>
                                    <button
                                        onClick={modal.onConfirm}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {modal.confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RecetasPanel;
