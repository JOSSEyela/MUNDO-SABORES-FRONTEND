import api from './axiosConfig';

//  Obtener todos los productos aprobados (públicos)
export const getProductosAprobados = async () => {
  const response = await api.get('/productos/aprobados');
  return response.data;
};

//  Obtener productos creados por el usuario actual
export const getMisProductos = async () => {
  const response = await api.get('/productos/mis-productos');
  return response.data;
};

//  Obtener productos pendientes (solo admin)
export const getProductosNoAprobados = async () => {
  const response = await api.get('/productos/no-aprobados');
  return response.data;
};

//  Obtener un producto por ID
export const getProductoById = async (id: number) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

//  Crear un nuevo producto (incluye stock)
export const crearProducto = async (productoData: {
  name: string;
  description: string;
  price: number;
  regionId: number;
  stock: number;
}) => {
  const response = await api.post('/productos', productoData);
  return response.data;
};

//  Actualizar un producto por ID (incluye stock)
export const actualizarProducto = async (
  id: number,
  productoData: {
    name: string;
    description: string;
    price: number;
    regionId: number;
    stock: number;
  }
) => {
  const response = await api.put(`/productos/${id}`, productoData);
  return response.data;
};

//  Aprobar un producto (admin)
export const aprobarProducto = async (id: number) => {
  const response = await api.patch(`/productos/${id}/aprobar`);
  return response.data;
};

//  Eliminar un producto
export const eliminarProducto = async (id: number) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};
