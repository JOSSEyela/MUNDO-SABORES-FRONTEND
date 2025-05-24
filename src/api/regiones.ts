import api from './axiosConfig';

export const getRegiones = async () => {
    const response = await api.get('/regiones');
    return response.data;
};

export const crearRegion = async (regionData: { nombre: string }) => {
    const response = await api.post('/regiones', regionData);
    return response.data;
};

export const eliminarRegion = async (id: number) => {
    const response = await api.delete(`/regiones/${id}`);
    return response.data;
};
