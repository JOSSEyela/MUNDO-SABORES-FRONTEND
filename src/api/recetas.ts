import api from './axiosConfig';

// Obtener todas las recetas aprobadas
export const getRecetasAprobadas = async () => {
    const response = await api.get('/recetas');
    return response.data;
};

// Crear una nueva receta
export const crearReceta = async (receta: {
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    region: string;
    categoriaId: number;
    
}) => {
    const response = await api.post('/recetas', receta);
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

// Obtener una receta por ID (para editar, por ejemplo)
export const getRecetaById = async (id: number) => {
    const response = await api.get(`/recetas/${id}`);
    return response.data;
};

// Actualizar una receta
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
    }
) => {
    const response = await api.put(`/recetas/${id}`, data);
    return response.data;
};
