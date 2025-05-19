import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReceta } from '../api/recetas';
import { getCategorias } from '../api/categorias';
import Navbar from '../pages/Navbar';
import { useAuth } from '../context/AuthContext';
import fondoRecetas from '../assets/images/fondo-recetas.jpg';

const CrearReceta: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [region, setRegion] = useState('');
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data);
                if (data.length > 0) setCategoriaId(data[0].id);
            } catch (err) {
                setError('Error al cargar categorías.');
            }
        };
        fetchCategorias();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!categoriaId) {
            setError('Por favor selecciona una categoría válida');
            return;
        }

        const receta = {
            title,
            description,
            ingredients,
            instructions,
            region,
            categoriaId,
        };

        try {
            await crearReceta(receta);

            if (user?.role === 'admin') {
                alert('✅ Receta creada y publicada exitosamente');
                navigate('/admin');
            } else {
                alert('✅ Receta enviada para aprobación del administrador');
                navigate('/user');
            }

        } catch (err: any) {
            console.error(err);
            setError('Error al crear la receta. Verifica los campos.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-[#fefcec] overflow-hidden">
                {/* Imagen de fondo decorativa */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondoRecetas}
                        alt="fondo recetas"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />

                </div>

                {/* Contenido principal del formulario */}
                <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 animate-fade-in"
                    >
                        <h2 className="text-2xl font-bold text-[#393939] text-center">Crear Receta</h2>

                        {error && (
                            <p className="text-red-600 font-medium text-sm bg-red-100 p-2 rounded">{error}</p>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Ingredientes</label>
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Instrucciones</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Región</label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#393939]">Categoría</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(Number(e.target.value))}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-coral focus:border-coral"
                            >
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-6 py-2 rounded-lg shadow-md font-medium transition transform hover:scale-105"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearReceta;

