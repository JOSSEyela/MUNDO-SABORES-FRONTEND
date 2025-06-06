import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar';
import { getRegiones } from '../../api/regiones';

interface Region {
  id: number;
  nombre: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  regionId: string;
}

const CrearProducto: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    regionId: '',
  });

  const [regiones, setRegiones] = useState<Region[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    const priceNum = parseFloat(formData.price);
    if (priceNum <= 0 || formData.name.trim().length < 3) {
      setError('Por favor verifica el nombre y precio del producto');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('/productos', {
        name: formData.name,
        description: formData.description,
        price: priceNum,
        regionId: Number(formData.regionId),
      });

      setMensaje('✅ Producto creado exitosamente');
      setFormData({ name: '', description: '', price: '', regionId: '' });
      setTimeout(() => navigate('/mis-productos'), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10 transition-colors">
        <div className="max-w-xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#393939] dark:text-white mb-6 text-center">
            Crear Producto
          </h2>

          {mensaje && (
            <p role="alert" className="text-green-600 dark:text-green-400 text-sm mb-4 animate-pulse">
              {mensaje}
            </p>
          )}
          {error && (
            <p role="alert" className="text-red-600 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}
          {isSubmitting && (
            <p className="text-blue-500 text-sm mb-3 animate-pulse">Creando producto...</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block font-medium text-[#393939] dark:text-gray-200">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-label="Nombre del producto"
                placeholder="Ej. Café Putumayo"
                className={`w-full mt-1 px-4 py-2 border rounded focus:outline-none transition 
                  ${formData.name.length > 0 && formData.name.length < 3 ? 'border-red-500 ring-red-400' : 'focus:ring-2 focus:ring-[#eb8369]'} 
                  dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600`}
              />
              {formData.name && formData.name.length < 3 && (
                <p className="text-xs text-red-500 mt-1">El nombre debe tener al menos 3 caracteres.</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block font-medium text-[#393939] dark:text-gray-200">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe brevemente el producto..."
                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="price" className="block font-medium text-[#393939] dark:text-gray-200">
                💲 Precio
              </label>
              <input
                id="price"
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Ej. 7500"
                aria-label="Precio del producto"
                className={`w-full mt-1 px-4 py-2 border rounded focus:outline-none transition 
                  ${parseFloat(formData.price) <= 0 ? 'border-red-500 ring-red-400' : 'focus:ring-2 focus:ring-[#eb8369]'} 
                  dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600`}
              />
              {formData.price && parseFloat(formData.price) <= 0 && (
                <p className="text-xs text-red-500 mt-1">El precio debe ser mayor a cero.</p>
              )}
            </div>

            <div>
              <label htmlFor="regionId" className="block font-medium text-[#393939] dark:text-gray-200">
                Región
              </label>
              <select
                id="regionId"
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

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate('/mis-productos')}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
              >
                ← Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-6 py-2 rounded shadow-md font-medium transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
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

