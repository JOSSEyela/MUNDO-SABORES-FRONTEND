import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReceta } from '../api/recetas';
import { getCategorias } from '../api/categorias';
import { getRegiones } from '../api/regiones';
import Navbar from '../pages/Navbar';
import { useAuth } from '../context/AuthContext';
import fondoRecetas from '../assets/images/fondo-recetas.jpg';
import { toast } from 'react-toastify';
import MapaSelector from '../components/MapaSelector';

const CrearReceta: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [regionId, setRegionId] = useState<number>(0);
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [imagen, setImagen] = useState<File | null>(null);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [regiones, setRegiones] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [latitud, setLatitud] = useState<number>(1.2089);     // Mocoa por defecto
    const [longitud, setLongitud] = useState<number>(-76.6743);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (title || description || ingredients || instructions || imagen) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [title, description, ingredients, instructions, imagen]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, regs] = await Promise.all([getCategorias(), getRegiones()]);
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
        if (!title || !description || !ingredients || !instructions || !regionId || !categoriaId || !imagen) {
            setError('❌ Todos los campos son obligatorios.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!validarCampos()) {
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', ingredients);
        formData.append('instructions', instructions);
        formData.append('regionId', String(regionId));
        formData.append('categoriaId', String(categoriaId));
        formData.append('latitud', String(latitud));
        formData.append('longitud', String(longitud));
        if (imagen) formData.append('imagen', imagen);

        try {
            await crearReceta(formData);
            toast.success(
                user?.role === 'admin'
                    ? ' Receta creada y publicada exitosamente'
                    : ' Receta enviada para aprobación'
            );
            if (user?.role !== 'admin') {
                setTitle('');
                setDescription('');
                setIngredients('');
                setInstructions('');
                setImagen(null);
            }
            navigate(user?.role === 'admin' ? '/admin' : '/user');
        } catch (err) {
            console.error(err);
            setError(' Error al crear la receta. Verifica los campos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-ivory dark:bg-[#1e1e1e]">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondoRecetas}
                        alt="Fondo recetas"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="max-w-3xl mx-auto bg-white dark:bg-[#2c2c2c] backdrop-blur-xl rounded-2xl shadow-xl p-10 space-y-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-3xl font-bold text-center text-[#393939] dark:text-white mb-6">
                            Crear Receta
                        </h2>

                        {error && (
                            <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 font-medium text-sm p-2 rounded">
                                {error}
                            </p>
                        )}

                        {/* Información general */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#393939] dark:text-white">Información general</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Sancocho de gallina"
                                    className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral ${
                                        !title && error ? 'border-red-500' : ''
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Breve historia o contexto del plato"
                                    className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm resize-none focus:ring-2 focus:ring-coral ${
                                        !description && error ? 'border-red-500' : ''
                                    }`}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Ingredientes e instrucciones */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#393939] dark:text-white">Contenido</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Ingredientes</label>
                                <textarea
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                    placeholder="Lista de ingredientes separados por coma"
                                    className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm resize-none focus:ring-2 focus:ring-coral ${
                                        !ingredients && error ? 'border-red-500' : ''
                                    }`}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Instrucciones</label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Pasos detallados para la preparación"
                                    className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm resize-none focus:ring-2 focus:ring-coral ${
                                        !instructions && error ? 'border-red-500' : ''
                                    }`}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Clasificación y Mapa */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#393939] dark:text-white">Clasificación</h3>

                            <div>
                                <label className="block font-medium text-sm text-gray-700 dark:text-white">Región</label>
                                <select
                                    value={regionId}
                                    onChange={(e) => setRegionId(Number(e.target.value))}
                                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral"
                                >
                                    {regiones.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-sm text-gray-700 dark:text-white">Categoría</label>
                                <select
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral"
                                >
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-[#393939] dark:text-white">Ubicación</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Haz clic en el mapa para seleccionar la ubicación geográfica de esta receta.</p>
                                <MapaSelector
                                    lat={latitud}
                                    lng={longitud}
                                    onChange={(lat, lng) => {
                                        setLatitud(lat);
                                        setLongitud(lng);
                                    }}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                                    Latitud: {latitud.toFixed(5)} | Longitud: {longitud.toFixed(5)}
                                </p>
                            </div>
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="block font-medium text-sm text-gray-700 dark:text-white">Imagen de la Receta</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                                className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm ${
                                    !imagen && error ? 'border-red-500' : ''
                                }`}
                            />
                            {imagen && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vista previa:</p>
                                    <img
                                        src={URL.createObjectURL(imagen)}
                                        alt="Vista previa"
                                        className="w-48 h-auto rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-coral hover:bg-[#e26a4d] text-white px-6 py-2 rounded-lg shadow-md font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Receta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearReceta;
