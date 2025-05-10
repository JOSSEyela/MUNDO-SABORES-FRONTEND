import api from './axiosConfig';

export const addFavorite = async (recipeId: string) => {
    const response = await api.post('/favorites', { recipeId });
    return response.data;
};
