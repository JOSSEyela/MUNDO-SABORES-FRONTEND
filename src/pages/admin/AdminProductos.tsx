import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import Navbar from '../Navbar'; // Asegúrate de que esta ruta es correcta según tu estructura

const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  const aprobarProducto = async (id: number) => {
    try {
      await api.put(`/productos/${id}`, { aprobado: true });
      cargarProductos(); // refrescar la lista
    } catch (err) {
      console.error('Error al aprobar producto', err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-4">
        <h2 className="text-3xl font-bold text-[#393939] mb-6 text-center">Productos Pendientes</h2>

        {productos.filter((p: any) => !p.aprobado).length === 0 ? (
          <p className="text-center text-gray-500">No hay productos pendientes de aprobación.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos
              .filter((producto: any) => !producto.aprobado)
              .map((producto: any) => (
                <div key={producto.id} className="bg-white p-5 rounded-xl shadow border transition hover:shadow-lg">
                  <h3 className="text-xl font-semibold text-[#393939] mb-2">{producto.name}</h3>
                  <p className="text-gray-700">{producto.description}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    Creado por: <span className="font-medium">{producto.usuario?.username || 'Desconocido'}</span>
                  </p>
                  <p className="text-sm text-gray-500">Región: {producto.region}</p>
                  <p className="text-sm text-gray-500">Precio: ${producto.price}</p>

                  <button
                    onClick={() => aprobarProducto(producto.id)}
                    className="mt-4 w-full bg-[#eb8369] text-white px-4 py-2 rounded hover:bg-[#cf6d55] transition"
                  >
                    ✅ Aprobar
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProductos;