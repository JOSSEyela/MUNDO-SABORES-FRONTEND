// src/pages/MisProductos.tsx
import React, { useEffect, useState } from 'react';
import { getMisProductos } from '../api/productos'; // usa la función abstracta
import Navbar from './Navbar'; // ajusta si está en otro subdirectorio

const MisProductos: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisProductos = async () => {
      try {
        const data = await getMisProductos(); // llamada desde productos.ts
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos del usuario:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMisProductos();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold text-[#393939] mb-6 text-center">Mis Productos</h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-500">No has creado productos aún.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className={`bg-white p-5 rounded-xl border shadow-md hover:shadow-lg transition ${
                  producto.aprobado ? 'border-green-300' : 'border-yellow-300'
                }`}
              >
                <h3 className="text-xl font-semibold text-[#393939]">{producto.name}</h3>
                <p className="text-gray-700 mt-1">{producto.description}</p>
                <p className="text-sm mt-2 text-gray-500">
                  <strong>Región:</strong> {producto.region}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Precio:</strong> ${producto.price}
                </p>
                <p className="text-sm mt-3 font-semibold">
                  Estado:{' '}
                  <span className={producto.aprobado ? 'text-green-600' : 'text-yellow-600'}>
                    {producto.aprobado ? '✅ Aprobado' : '⌛ Pendiente de aprobación'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MisProductos;