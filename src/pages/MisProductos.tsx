import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisProductos, eliminarProducto } from '../api/productos';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

interface Producto {
  id: number;
  name: string;
  description: string;
  precio: number;
  aprobado: boolean;
  region: {
    id: number;
    nombre: string;
  };
}

const MisProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'aprobados' | 'pendientes'>('todos');
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const data = await getMisProductos();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos del usuario:', err);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEditar = (id: number) => {
    navigate(`/editar-producto/${id}`);
  };

  const handleEliminar = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.');
    if (!confirm) return;

    try {
      await eliminarProducto(id);
      toast.success('🗑️ Producto eliminado correctamente');
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      toast.error('❌ Error al eliminar producto');
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.name.toLowerCase().includes(search.toLowerCase());
    const coincideEstado =
      filtroEstado === 'todos' ||
      (filtroEstado === 'aprobados' && producto.aprobado) ||
      (filtroEstado === 'pendientes' && !producto.aprobado);
    return coincideBusqueda && coincideEstado;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-[#393939] dark:text-white">Mis Productos 🛒</h2>
          <p className="text-gray-500 mt-2 dark:text-gray-400">
            Gestiona tus productos: edición, eliminación y visualización
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'aprobados' | 'pendientes')}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-white"
          >
            <option value="todos">Todos</option>
            <option value="aprobados">Aprobados</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No hay productos que coincidan con tu búsqueda.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className={`bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-xl border-l-4 ${
                  producto.aprobado ? 'border-green-400' : 'border-yellow-400'
                } transition-transform transform hover:scale-[1.02] duration-200`}
              >
                <h3 className="text-2xl font-semibold text-[#393939] dark:text-white mb-2">
                  📦 {producto.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {producto.description || 'Sin descripción'}
                </p>
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                  <p>
                    🌍 <strong>Región:</strong> {producto.region?.nombre || 'Sin región'}
                  </p>
                  <p>
                    💲 <strong>Precio:</strong> ${producto.precio}
                  </p>
                  <p>
                    🏷️ <strong>Estado:</strong>{' '}
                    <span
                      className={
                        producto.aprobado
                          ? 'text-green-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }
                    >
                      {producto.aprobado ? '✅ Aprobado' : '⌛ Pendiente'}
                    </span>
                  </p>
                </div>

                {!producto.aprobado && (
                  <div className="mt-6 flex justify-center gap-6">
                    <button
                      onClick={() => handleEditar(producto.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(producto.id)}
                      className="text-red-500 hover:text-red-700 font-medium transition"
                    >
                      🗑️ Eliminar
                    </button>
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

export default MisProductos;
