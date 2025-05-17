// src/api/productos.ts
import api from './axiosConfig';

// Obtener todos los productos
export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

// Obtener productos creados por el usuario actual
export const getMisProductos = async () => {
  const response = await api.get('/productos/mis-productos');
  return response.data;
};

// Crear un nuevo producto
export const crearProducto = async (productoData: {
  name: string;
  description: string;
  price: number;
  region: string;
}) => {
  const response = await api.post('/productos', productoData);
  return response.data;
};

// Aprobar un producto por ID
export const aprobarProducto = async (id: number) => {
  const response = await api.put(`/productos/${id}`, { aprobado: true });
  return response.data;
};

// Eliminar un producto por ID
export const eliminarProducto = async (id: number) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

// Obtener un producto por ID (opcional)
export const getProductoById = async (id: number) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};