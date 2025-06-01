import api from './axiosConfig';

// Obtener comentarios de una receta específica
export const getComentarios = async (recetaId: number) => {
    const res = await api.get(`/comentarios/${recetaId}`);
    return res.data;
};

// Crear un nuevo comentario para una receta
export const crearComentario = async (comentario: {
    contenido: string;
    recetaId: number;
}) => {
    const res = await api.post(`/comentarios`, comentario);
    return res.data;
};

// Eliminar un comentario por su ID (requiere autenticación)
export const eliminarComentario = async (comentarioId: number) => {
    const res = await api.delete(`/comentarios/${comentarioId}`);
    return res.data;
};
