import api from './axiosConfig';

// Obtener todos los usuarios (solo para admin)
export const getUsuarios = async () => {
    const response = await api.get('/usuarios');
    return response.data;
};

// Obtener el perfil público de un usuario por ID
export const getPerfil = async (id: number) => {
    const response = await api.get(`/usuarios/perfil/${id}`);
    return response.data;
};

// Actualizar los datos del perfil de un usuario
export const updatePerfil = async (id: number, data: any) => {
    const response = await api.put(`/usuarios/perfil/${id}`, data);
    return response.data;
};

// Subir el avatar de un usuario y devolver su nueva URL
export const uploadAvatar = async (id: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/usuarios/avatar/${id}`, formData);
    return response.data.avatarUrl; 
};
