import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: { name: string };
}

const UsuarioPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const cargarUsuarios = async () => {
        try {
            const res = await api.get('/auth');
            if (Array.isArray(res.data)) {
                setUsuarios(res.data);
            } else {
                setError('La respuesta del servidor no es válida.');
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios.');
        }
    };

    const eliminarUsuario = async (id: number) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmar) return;

        try {
            await api.delete(`/auth/${id}`);
            setMensaje('✅ Usuario eliminado correctamente.');
            cargarUsuarios();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError('No se pudo eliminar el usuario.');
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Filtrar usuarios únicos por ID
    const usuariosUnicos = usuarios.filter(
        (usuario, index, self) =>
            index === self.findIndex((u) => u.id === usuario.id)
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-[#393939] mb-4">Gestión de Usuarios</h2>

            {error && <p className="text-red-600 font-medium mb-2">{error}</p>}
            {mensaje && <p className="text-green-600 font-medium mb-2">{mensaje}</p>}

            {usuariosUnicos.length === 0 && !error ? (
                <p className="text-gray-600">No hay usuarios registrados.</p>
            ) : (
                <ul className="space-y-3">
                    {usuariosUnicos.map((u) => (
                        <li
                            key={u.id}
                            className="flex items-center justify-between bg-[#fefcec] border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <span className="text-[#393939]">
                                👤 <strong>{u.username}</strong> – Rol: {u.rol?.name ?? 'Desconocido'}
                            </span>
                            <button
                                onClick={() => eliminarUsuario(u.id)}
                                className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-3 py-1 rounded text-sm"
                            >
                                🗑️ Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsuarioPanel;
