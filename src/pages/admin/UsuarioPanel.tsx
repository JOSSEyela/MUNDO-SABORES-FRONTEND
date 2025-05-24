import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api, { BACKEND_URL } from '../../api/axiosConfig';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Usuario {
    id: number;
    username: string;
    email: string;
    rol: { name: string };
    avatarUrl?: string;
    nombres?: string;
    apellidos?: string;
    biografia?: string;
    fechaNacimiento?: string;
}

const UsuarioPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filtro, setFiltro] = useState('');

    const cargarUsuarios = async () => {
        try {
            const res = await api.get('/usuarios');
            if (Array.isArray(res.data)) {
                setUsuarios(res.data);
            } else {
                toast.error('⚠️ La respuesta del servidor no es válida.');
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            toast.error('❌ No se pudieron cargar los usuarios.');
        }
    };

    const eliminarUsuario = async (id: number) => {
        const confirmar = window.confirm('⚠️ ¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmar) return;

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success('✅ Usuario eliminado correctamente.');
            cargarUsuarios();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            toast.error('❌ No se pudo eliminar el usuario. Puede tener recetas o productos asociados.');
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const usuariosFiltrados = usuarios.filter((u) =>
        `${u.username} ${u.email} ${u.nombres ?? ''} ${u.apellidos ?? ''}`
            .toLowerCase()
            .includes(filtro.toLowerCase())
    );

    const columnas = [
        {
            name: '🖼️',
            cell: (row: Usuario) => (
                <img
                    src={
                        row.avatarUrl
                            ? `${BACKEND_URL}${row.avatarUrl}`
                            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                />
            ),
            width: '70px',
            ignoreRowClick: true,
        },
        {
            name: '👤 Usuario',
            selector: (row: Usuario) => row.username,
            sortable: true,
        },
        {
            name: '📛 Nombres',
            selector: (row: Usuario) => row.nombres || '-',
            sortable: true,
        },
        {
            name: '🧾 Apellidos',
            selector: (row: Usuario) => row.apellidos || '-',
            sortable: true,
        },
        {
            name: '📧 Email',
            selector: (row: Usuario) => row.email,
            sortable: true,
        },
        {
            name: '📝 Biografía',
            selector: (row: Usuario) => row.biografia || '-',
            wrap: true,
        },
        {
            name: '🎂 Nacimiento',
            selector: (row: Usuario) =>
                row.fechaNacimiento ? new Date(row.fechaNacimiento).toLocaleDateString() : '-',
            sortable: true,
        },
        {
            name: '🔖 Rol',
            selector: (row: Usuario) => row.rol?.name ?? 'Desconocido',
            sortable: true,
        },
        {
            name: '🗑️ Acciones',
            cell: (row: Usuario) => (
                <button
                    onClick={() => eliminarUsuario(row.id)}
                    className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-3 py-1 rounded text-sm shadow transition duration-200"
                >
                    Eliminar
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-white to-[#fefcec] dark:from-[#1a1a1a] dark:via-[#111] dark:to-[#1a1a1a] p-6 space-y-6 transition-colors">
                <h2 className="text-2xl font-semibold text-[#393939] dark:text-white">Gestión de Usuarios</h2>

                <input
                    type="text"
                    placeholder="Buscar por usuario, email o nombre..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                />

                <div className="rounded-lg overflow-hidden border border-[#dbdbd0] dark:border-gray-700 bg-white dark:bg-[#2b2b2b] shadow transition">
                    <DataTable
                        columns={columnas}
                        data={usuariosFiltrados}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        noDataComponent={
                            <div className="text-gray-500 py-4 text-center dark:text-gray-400">
                                No hay usuarios registrados.
                            </div>
                        }
                        customStyles={{
                            headCells: {
                                style: {
                                    backgroundColor: '#FEFCEC',
                                    color: '#393939',
                                    fontWeight: '600',
                                },
                            },
                            rows: {
                                style: {
                                    fontSize: '14px',
                                    color: '#393939',
                                },
                            },
                            pagination: {
                                style: {
                                    backgroundColor: '#fff',
                                    borderTop: '1px solid #DBDBD0',
                                    padding: '12px',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default UsuarioPanel;
