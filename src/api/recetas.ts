import api from './axiosConfig';

// Obtener todas las recetas aprobadas
export const getRecetasAprobadas = async () => {
    const response = await api.get('/recetas');
    return response.data;
};

// Crear una nueva receta con imagen y ubicación
export const crearReceta = async (formData: FormData) => {
    const response = await api.post('/recetas', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Obtener recetas del usuario actual
export const getMisRecetas = async () => {
    const response = await api.get('/recetas/mis-recetas');
    return response.data;
};

// Eliminar una receta propia
export const eliminarReceta = async (id: number) => {
    await api.delete(`/recetas/${id}`);
};

// Obtener una receta por ID (para editar o ver detalle)
export const getRecetaById = async (id: number) => {
    const response = await api.get(`/recetas/${id}`);
    return response.data;
};

// Actualizar una receta (incluyendo ubicación si aplica)
export const actualizarReceta = async (
    id: number,
    data: {
        title?: string;
        description?: string;
        ingredients?: string;
        instructions?: string;
        region?: string;
        categoriaId?: number;
        usuarioId?: string;
        latitud?: number;
        longitud?: number;
    }
) => {
    const response = await api.put(`/recetas/${id}`, data);
    return response.data;
};

// Obtener calificación del usuario actual para una receta
export const getCalificacionUsuario = async (recetaId: number) => {
    const response = await api.get(`/recetas/${recetaId}/calificacion-usuario`);
    return response.data;
};

// Calificar una receta
export const calificarReceta = async (recetaId: number, calificacion: number) => {
    const response = await api.patch(`/recetas/${recetaId}/calificar`, { calificacion });
    return response.data;
};

// Obtener la cantidad total de usuarios que han calificado una receta
export const getTotalCalificadores = async (recetaId: number): Promise<number> => {
    const response = await api.get(`/recetas/${recetaId}/total-calificadores`);
    return response.data.total;
};
