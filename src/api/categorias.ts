import api from './axiosConfig';

export const getCategorias = async () => {
    const response = await api.get('/categorias');
    return response.data;
};
