import api from "./axiosConfig";


// Obtener todas las recetas que aún no han sido aprobadas
export const getRecetasNoAprobadas = async () => {
    const response = await api.get('/recetas/pendientes');
    return response.data;
};

// Aprobar una receta por ID
export const aprobarReceta = async (id: number) => {
    const response = await api.patch(`/recetas/${id}/aprobar`);
    return response.data;
};

// Eliminar una receta por ID
export const eliminarReceta = async (id: number) => {
    const response = await api.delete(`/recetas/${id}`);
    return response.data;
};
