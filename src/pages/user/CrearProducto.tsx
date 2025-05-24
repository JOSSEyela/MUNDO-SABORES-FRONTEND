import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar';
import { getRegiones } from '../../api/regiones';

const CrearProducto: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    regionId: '',
  });

  const [regiones, setRegiones] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const data = await getRegiones();
        setRegiones(data);
      } catch (err) {
        console.error('Error al cargar regiones', err);
        setError('Error al cargar las regiones');
      }
    };
    cargarRegiones();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await api.post('/productos', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        regionId: Number(formData.regionId),
      });

      setMensaje('✅ Producto creado exitosamente');
      setFormData({ name: '', description: '', price: '', regionId: '' });
      setTimeout(() => navigate('/mis-productos'), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear el producto');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10 transition-colors">
        <div className="max-w-xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#393939] dark:text-white mb-6 text-center">
            🛍️ Crear Producto
          </h2>

          {mensaje && (
            <p className="text-green-600 dark:text-green-400 text-sm mb-4 animate-pulse">
              {mensaje}
            </p>
          )}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-[#393939] dark:text-gray-200">📛 Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full mt-1 px-4 py-2 border rounded focus:outline-none transition 
                  ${formData.name.length > 0 && formData.name.length < 3 ? 'border-red-500 ring-red-400' : 'focus:ring-2 focus:ring-[#eb8369]'} 
                  dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600`}
                placeholder="Ej. Café Putumayo"
              />
              {formData.name && formData.name.length < 3 && (
                <p className="text-xs text-red-500 mt-1">El nombre debe tener al menos 3 caracteres.</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-[#393939] dark:text-gray-200">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                placeholder="Describe brevemente el producto..."
              />
            </div>

            <div>
              <label className="block font-medium text-[#393939] dark:text-gray-200">💲 Precio</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={`w-full mt-1 px-4 py-2 border rounded focus:outline-none transition 
                  ${parseFloat(formData.price) <= 0 ? 'border-red-500 ring-red-400' : 'focus:ring-2 focus:ring-[#eb8369]'} 
                  dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600`}
                placeholder="Ej. 7500"
              />
              {formData.price && parseFloat(formData.price) <= 0 && (
                <p className="text-xs text-red-500 mt-1">El precio debe ser mayor a cero.</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-[#393939] dark:text-gray-200">🌎 Región</label>
              <select
                name="regionId"
                value={formData.regionId}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
              >
                <option value="">Seleccione una región</option>
                {regiones.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-6 py-2 rounded shadow-md font-medium transition duration-300 transform hover:scale-105 active:scale-95"
              >
                Crear Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearProducto;
