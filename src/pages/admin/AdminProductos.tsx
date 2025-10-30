import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fondo from '../../assets/images/fondo-recetas.jpg';

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  aprobado: boolean;
  region: {
    id: number;
    nombre: string;
  };
  usuario: {
    username: string;
  };
}

const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos/no-aprobados');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  const aprobarProducto = async (id: number) => {
    try {
      await api.patch(`/productos/${id}/aprobar`);
      toast.success('✅ Producto aprobado');
      cargarProductos();
    } catch (err) {
      console.error('Error al aprobar producto', err);
      toast.error('❌ Error al aprobar producto');
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/editar-producto/${id}`);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Fondo con imagen */}
        <div className="absolute top-0 left-0 right-0 bottom-0 -z-10">
          <img
            src={fondo}
            alt="fondo productos"
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-[#fefcec] via-white to-[#fefcec] dark:from-[#1a1a1a] dark:via-[#111] dark:to-[#1a1a1a]">
          <div className="max-w-6xl mx-auto mt-10 p-4 space-y-6 relative z-10">
            <h2 className="text-3xl font-bold text-[#393939] dark:text-white text-center">
              Productos Pendientes
            </h2>

            {productos.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No hay productos pendientes de aprobación.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-white dark:bg-[#2c2c2c] p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold text-[#393939] dark:text-white mb-2">
                      📦 {producto.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">{producto.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      👤 Usuario: <span className="font-medium">{producto.usuario?.username || 'Desconocido'}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      🌎 Región: {producto.region?.nombre || 'No especificada'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      💲 Precio: ${producto.price}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleEditar(producto.id)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => aprobarProducto(producto.id)}
                        className="flex-1 bg-[#eb8369] text-white px-4 py-2 rounded hover:bg-[#cf6d55] transition"
                      >
                        ✅ Aprobar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductos;
