import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPerfil, updatePerfil, uploadAvatar } from '../api/usuarios';
import { toast } from 'react-toastify';
import Navbar from '../pages/Navbar';
import { BACKEND_URL } from '../api/axiosConfig';
import '../styles/Perfil.css';

const Perfil: React.FC = () => {
    const { user, setUserAvatar } = useAuth();
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
    const isInitialLoad = useRef(true);

    const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

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
        }
    }, [user, setUserAvatar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePerfil(user!.id, form);
            toast.success('✅ Perfil actualizado correctamente');
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            toast.error('❌ No se pudo eliminar la foto');
        }
    };

    if (!perfil) return <p className="text-center mt-10 text-gray-500">Cargando perfil...</p>;

    const avatarUrl = perfil.avatarUrl
        ? `${BACKEND_URL}${perfil.avatarUrl}?t=${avatarTimestamp}`
        : defaultAvatar;

    return (
        <>
            <Navbar />
            <div className="bg-white w-full max-w-4xl mx-auto mt-10 rounded-lg shadow-md border border-gray-200">
                <h5 className="bg-gray-100 rounded-t-lg p-4 text-xl font-bold text-gray-800">Editar Perfil</h5>
                <div className="p-6">
                    {/* Foto de Perfil */}
                    <div className="text-center mb-8">
                        <h6 className="text-lg font-semibold mb-4">Foto de Perfil</h6>
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-28 h-28 rounded-full object-cover border shadow"
                            />
                            <input
                                type="file"
                                onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                                className="input-field w-full max-w-xs"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleAvatarUpload}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition"
                                >
                                    Subir Nueva Foto
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAvatarDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm transition"
                                >
                                    Eliminar Foto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Datos de Cuenta */}
                    <form onSubmit={handleUpdate} className="grid gap-y-6">
                        <div>
                            <h6 className="text-lg font-semibold">1. Datos de Cuenta</h6>
                            <hr className="mb-4 mt-2" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Nombres</label>
                                <input
                                    name="nombres"
                                    value={form.nombres}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label-text">Apellidos</label>
                                <input
                                    name="apellidos"
                                    value={form.apellidos}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label-text">Fecha de nacimiento</label>
                                <input
                                    name="fechaNacimiento"
                                    type="date"
                                    value={form.fechaNacimiento}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label-text">Biografía</label>
                            <textarea
                                name="biografia"
                                value={form.biografia}
                                onChange={handleChange}
                                placeholder="Escribe algo sobre ti..."
                                className="input-field h-24 resize-none"
                            />
                        </div>

                        <div className="text-end">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition text-sm font-semibold"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Perfil;
