import React, { useEffect, useState } from 'react';
import { getMisRecetas, eliminarReceta } from '../../api/recetas';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../pages/Navbar';

interface Receta {
    id: number;
    title: string;
    description: string;
    aprobado: boolean;
    categoria?: { nombre: string };
}

const MisRecetas: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const navigate = useNavigate();

    const cargarMisRecetas = async () => {
        try {
            const data = await getMisRecetas();
            setRecetas(data);
        } catch (error) {
            console.error('Error al cargar recetas:', error);
        }
    };

    useEffect(() => {
        cargarMisRecetas();
    }, []);

    const handleEditar = (id: number) => navigate(`/editar/${id}`);

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            try {
                await eliminarReceta(id);
                cargarMisRecetas();
            } catch (error) {
                alert('Error al eliminar la receta.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-6 sm:p-10">
                <h1 className="text-2xl font-bold text-[#393939] mb-6">Mis Recetas 🍲</h1>

                {recetas.length === 0 ? (
                    <p className="text-gray-600">No has creado recetas aún.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recetas.map((receta) => (
                            <div key={receta.id} className="card sm:max-w-sm bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden">
                                <figure>
                                    <img
                                        src="https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_960_720.jpg"// CAMBIAR ESTO POR UMA IMAGEN 
                                        alt="receta"
                                        className="w-full h-40 object-cover"
                                    />
                                </figure>
                                <div className="card-body p-4 space-y-3">
                                    <h3 className="card-title text-lg font-semibold text-[#393939]">
                                        {receta.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        <strong>Categoría:</strong> {receta.categoria?.nombre ?? 'Sin categoría'}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Aprobada:</strong>{' '}
                                        {receta.aprobado ? '✅ Sí' : '⏳ No aún'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {receta.description?.slice(0, 100)}...
                                    </p>

                                    {!receta.aprobado && (
                                        <div className="card-actions flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditar(receta.id)}
                                                className="btn btn-primary text-white px-4 py-2 text-sm"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(receta.id)}
                                                className="btn btn-secondary btn-soft px-4 py-2 text-sm"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MisRecetas;
