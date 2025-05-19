import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../api/axiosConfig';
import Navbar from '../Navbar';

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

    const usuariosUnicos = usuarios.filter(
        (usuario, index, self) =>
            index === self.findIndex((u) => u.id === usuario.id)
    );

    const columnas = [
        {
            name: '👤 Usuario',
            selector: (row: Usuario) => row.username,
            sortable: true,
        },
        {
            name: '📧 Email',
            selector: (row: Usuario) => row.email,
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
            <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-white to-[#fefcec] p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-[#393939]">Gestión de Usuarios</h2>

                {error && <p className="text-red-600 font-medium">{error}</p>}
                {mensaje && <p className="text-green-600 font-medium">{mensaje}</p>}

                <div className="rounded-lg overflow-hidden border border-[#dbdbd0] bg-white shadow">
                    <DataTable
                        columns={columnas}
                        data={usuariosUnicos}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        noDataComponent={
                            <div className="text-gray-500 py-4 text-center">No hay usuarios registrados.</div>
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
