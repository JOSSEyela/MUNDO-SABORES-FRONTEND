import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../pages/Navbar'; // Asegúrate de que la ruta sea correcta

const CrearProducto: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    region: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await api.post('/productos', {
        ...formData,
        price: parseFloat(formData.price) // Convertir precio a número
      });

      setMensaje('✅ Producto creado exitosamente');
      setFormData({ name: '', description: '', price: '', region: '' });
      setTimeout(() => navigate('/mis-productos'), 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear el producto');
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-[#393939] mb-6 text-center">Crear Producto</h2>

        {mensaje && <p className="text-green-600 text-sm mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-[#393939]">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#393939]">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#393939]">Precio</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#393939]">Región</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369]"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#eb8369] text-white px-6 py-2 rounded hover:bg-[#cf6d55] transition"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CrearProducto;