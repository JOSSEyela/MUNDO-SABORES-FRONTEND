import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import Navbar from '../Navbar';
import { getCategorias } from '../../api/categorias';
import { getRegiones } from '../../api/regiones';
import { useAuth } from '../../context/AuthContext';
import fondo from '../../assets/images/fondo-recetas.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarReceta: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | ''>('');
    const [regionId, setRegionId] = useState<number | ''>('');
    const [categorias, setCategorias] = useState<any[]>([]);
    const [regiones, setRegiones] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recetaRes, categoriasRes, regionesRes] = await Promise.all([
                    axios.get(`/recetas/${id}`),
                    getCategorias(),
                    getRegiones()
                ]);
                const receta = recetaRes.data;

                setTitle(receta.title);
                setDescription(receta.description);
                setIngredients(receta.ingredients);
                setInstructions(receta.instructions);
                setCategoriaId(receta.categoria?.id ?? '');
                setRegionId(receta.region?.id ?? '');
                setCategorias(categoriasRes);
                setRegiones(regionesRes);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos de la receta');
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!categoriaId || !regionId) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            await axios.put(`/recetas/${id}`, {
                title,
                description,
                ingredients,
                instructions,
                categoriaId,
                regionId
            });

            toast.success('✅ Receta actualizada correctamente', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });

            setTimeout(() => {
                navigate(user?.role === 'admin' ? '/admin' : '/user');
            }, 1200);
        } catch (error) {
            console.error(error);
            toast.error('❌ Error al actualizar la receta', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="relative min-h-screen bg-gradient-to-br from-[#fefcec] via-[#e6f4f1] to-[#d7e4dc] dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#161616] px-6 py-10">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondo}
                        alt="Fondo decorativo"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl p-8 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-[#393939] dark:text-white">✏️ Editar Receta</h2>
                    {error && <p className="text-red-600 dark:text-red-400 text-center text-sm">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Ingredientes</label>
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Instrucciones</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Región</label>
                            <select
                                value={regionId}
                                onChange={(e) => setRegionId(Number(e.target.value))}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            >
                                <option value="">Seleccione una región</option>
                                {regiones.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-[#393939] dark:text-white">Categoría</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(Number(e.target.value))}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-[#1f1f1f] dark:text-white focus:ring-2 focus:ring-[#eb8369]"
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-[#eb8369] hover:bg-[#cf6d55] text-white px-6 py-2 rounded shadow-md font-medium transition transform hover:scale-105"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarReceta;
