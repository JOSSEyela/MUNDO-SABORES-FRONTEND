import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPerfil, updatePerfil, uploadAvatar } from '../api/usuarios';
import { getMisRecetas, eliminarReceta } from '../api/recetas';
import { getMisProductos } from '../api/productos';
import { toast } from 'react-toastify';
import Navbar from '../pages/Navbar';
import { BACKEND_URL } from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Perfil: React.FC = () => {
    const { user, setUserAvatar } = useAuth();
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState<any>(null);
    const [form, setForm] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        biografia: '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarTimestamp, setAvatarTimestamp] = useState<number>(Date.now());
    const [tab, setTab] = useState<'perfil' | 'recetas' | 'productos'>('perfil');
    const [recetas, setRecetas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (user && isInitialLoad.current) {
            getPerfil(user.id).then(res => {
                setPerfil(res);
                setForm({
                    username: res.username ?? '',
                    nombres: res.nombres ?? '',
                    apellidos: res.apellidos ?? '',
                    email: res.email ?? '',
                    fechaNacimiento: res.fechaNacimiento?.substring(0, 10) ?? '',
                    biografia: res.biografia ?? '',
                });
                if (res.avatarUrl) {
                    setUserAvatar(res.avatarUrl);
                    setAvatarTimestamp(Date.now());
                }
                isInitialLoad.current = false;
            });

            cargarRecetas();
            getMisProductos().then(setProductos);
        }
    }, [user]);

    const cargarRecetas = async () => {
        const data = await getMisRecetas();
        setRecetas(data);
    };

    const handleEliminarReceta = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                toast.success('🗑️ Receta eliminada');
                cargarRecetas();
            } catch {
                toast.error('❌ Error al eliminar');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePerfil(user!.id, form);
            toast.success('✅ Perfil actualizado correctamente');
        } catch {
            toast.error('❌ Error al actualizar el perfil');
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        try {
            await uploadAvatar(user!.id, avatarFile);
            const updated = await getPerfil(user!.id);
            setPerfil(updated);
            setAvatarTimestamp(Date.now());
            if (updated.avatarUrl) {
                setUserAvatar(updated.avatarUrl);
            }
            toast.success('✅ Avatar actualizado correctamente');
        } catch {
            toast.error('❌ Error al subir el avatar');
        }
    };

    const handleAvatarDelete = async () => {
        try {
            await updatePerfil(user!.id, { avatarUrl: null });
            const updated = await getPerfil(user!.id);
            setPerfil(updated);
            setUserAvatar('');
            setAvatarTimestamp(Date.now());
            toast.success('🗑️ Foto de perfil eliminada');
        } catch {
            toast.error('❌ No se pudo eliminar la foto');
        }
    };

    const avatarUrl = perfil?.avatarUrl
        ? `${BACKEND_URL}${perfil.avatarUrl}?t=${avatarTimestamp}`
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const recetasAprobadas = recetas.filter(r => r.aprobado);
    const recetasPendientes = recetas.filter(r => !r.aprobado);
    const productosAprobados = productos.filter(p => p.aprobado);
    const productosPendientes = productos.filter(p => !p.aprobado);

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-6">
                    {['perfil', 'recetas', 'productos'].map(item => (
                        <button
                            key={item}
                            onClick={() => setTab(item as typeof tab)}
                            className={`px-6 py-2 rounded-full font-semibold text-sm transition 
                            ${tab === item
                                    ? 'bg-[#EB8369] text-white shadow-md'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab: Perfil */}
                {tab === 'perfil' && perfil && (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tu Foto de Perfil</h2>
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#EB8369] shadow-md"
                                />
                                <input
                                    type="file"
                                    onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                                    className="file-input text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded"
                                />
                                <div className="flex gap-3">
                                    <button onClick={handleAvatarUpload} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition">Subir</button>
                                    <button onClick={handleAvatarDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded transition">Eliminar</button>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" className="input-field bg-white dark:bg-gray-800 border px-4 py-2 rounded" />
                                <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" className="input-field bg-white dark:bg-gray-800 border px-4 py-2 rounded" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="input-field bg-white dark:bg-gray-800 border px-4 py-2 rounded" />
                                <input name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} type="date" className="input-field bg-white dark:bg-gray-800 border px-4 py-2 rounded" />
                            </div>
                            <textarea name="biografia" value={form.biografia} onChange={handleChange} placeholder="Biografía" className="input-field h-24 bg-white dark:bg-gray-800 border px-4 py-2 rounded resize-none" />
                            <div className="text-end">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-semibold">Guardar Cambios</button>
                            </div>
                        </form>
                    </>
                )}

                {/* Tab: Recetas */}
                {tab === 'recetas' && (
    <div className="grid md:grid-cols-2 gap-6">
        {[{ title: 'Recetas Aprobadas', data: recetasAprobadas, tipo: 'ver' }, { title: 'Recetas Pendientes', data: recetasPendientes, tipo: 'editar' }].map(section => (
            <div key={section.title}>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{section.title}</h3>
                {section.data.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-300">No hay recetas.</p>
                ) : (
                    <div className="grid gap-4">
                        {section.data.map(r => (
                            <div
                                key={r.id}
                                className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600 space-y-2 transition duration-200 ${
                                    section.tipo === 'ver' ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : ''
                                }`}
                                onClick={() => section.tipo === 'ver' && navigate(`/recetas/${r.id}`)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#EB8369]">{r.title}</h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{r.description}</p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {section.tipo === 'ver' ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/recetas/${r.id}`);
                                                }}
                                                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium shadow-md"
                                            >
                                                👁️ Ver
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/editar/${r.id}`);
                                                    }}
                                                    className="text-yellow-600 hover:underline text-sm font-medium"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEliminarReceta(r.id);
                                                    }}
                                                    className="text-red-600 hover:underline text-sm font-medium"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
    </div>
)}


                {/* Tab: Productos */}
                {tab === 'productos' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[{ title: 'Productos Aprobados', data: productosAprobados }, { title: 'Productos Pendientes', data: productosPendientes }].map(section => (
                            <div key={section.title}>
                                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{section.title}</h3>
                                {section.data.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-300">No hay productos.</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {section.data.map(p => (
                                            <div key={p.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600">
                                                <h4 className="text-lg font-semibold text-green-600">{p.name}</h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{p.descripcion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Perfil;
