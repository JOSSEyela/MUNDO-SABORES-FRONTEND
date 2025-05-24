import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReceta } from '../api/recetas';
import { getCategorias } from '../api/categorias';
import { getRegiones } from '../api/regiones';
import Navbar from '../pages/Navbar';
import { useAuth } from '../context/AuthContext';
import fondoRecetas from '../assets/images/fondo-recetas.jpg';
import { toast } from 'react-toastify';

const CrearReceta: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [regionId, setRegionId] = useState<number>(0);
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [regiones, setRegiones] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, regs] = await Promise.all([
                    getCategorias(),
                    getRegiones()
                ]);
                setCategorias(cats);
                setRegiones(regs);
                if (cats.length > 0) setCategoriaId(cats[0].id);
                if (regs.length > 0) setRegionId(regs[0].id);
            } catch {
                setError('Error al cargar categorías o regiones.');
            }
        };
        fetchData();
    }, []);

    const validarCampos = () => {
        if (!title || !description || !ingredients || !instructions || !regionId || !categoriaId) {
            setError('❌ Todos los campos son obligatorios.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validarCampos()) return;

        const region = regiones.find((r) => r.id === regionId)?.nombre || '';
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
            toast.success(user?.role === 'admin'
                ? '✅ Receta creada y publicada exitosamente'
                : '✅ Receta enviada para aprobación');
            navigate(user?.role === 'admin' ? '/admin' : '/user');
        } catch (err) {
            console.error(err);
            setError('Error al crear la receta. Verifica los campos.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-ivory dark:bg-[#1e1e1e] transition-colors overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondoRecetas}
                        alt="fondo recetas"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto bg-white/90 dark:bg-[#2c2c2c]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 dark:border-gray-700 animate-fade-in"
                    >
                        <h2 className="text-2xl font-bold text-center text-[#393939] dark:text-white">
                            Crear Receta
                        </h2>

                        {error && (
                            <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 font-medium text-sm p-2 rounded">
                                {error}
                            </p>
                        )}

                        <div>
                            <label className="label-text dark:text-gray-200">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Sancocho de gallina"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="label-text dark:text-gray-200">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Breve historia o contexto del plato"
                                className="input-field h-20"
                            />
                        </div>

                        <div>
                            <label className="label-text dark:text-gray-200">Ingredientes</label>
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="Lista de ingredientes separados por coma"
                                className="input-field h-20"
                            />
                        </div>

                        <div>
                            <label className="label-text dark:text-gray-200">Instrucciones</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Pasos detallados para la preparación"
                                className="input-field h-24"
                            />
                        </div>

                        <div>
                            <label className="label-text dark:text-gray-200">Región</label>
                            <select
                                value={regionId}
                                onChange={(e) => setRegionId(Number(e.target.value))}
                                className="input-field"
                            >
                                {regiones.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label-text dark:text-gray-200">Categoría</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(Number(e.target.value))}
                                className="input-field"
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
                                className="bg-coral hover:bg-peach text-white px-6 py-2 rounded-lg shadow-md font-medium transition transform hover:scale-105"
                            >
                                Enviar Receta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearReceta;
