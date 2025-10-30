import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearReceta } from '../api/recetas';
import { getCategorias } from '../api/categorias';
import { getRegiones } from '../api/regiones';
import Navbar from '../pages/Navbar';
import { useAuth } from '../context/AuthContext';
import fondoRecetas from '../assets/images/fondo-recetas.jpg';
import { toast } from 'react-toastify';
import MapaSelector from '../components/MapaSelector';

type Paso = { id: string; texto: string };
type Chip = { id: string; texto: string };

const CrearReceta: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Wizard
    const [step, setStep] = useState<number>(0);
    const steps = ['Datos', 'Contenido', 'Clasificación', 'Imagen', 'Ubicación'];

    // Datos
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Contenido mejorado
    const [ingredienteInput, setIngredienteInput] = useState('');
    const [ingredientes, setIngredientes] = useState<Chip[]>([]);
    const [pasoInput, setPasoInput] = useState('');
    const [pasos, setPasos] = useState<Paso[]>([]);

    // Selects
    const [regionId, setRegionId] = useState<number>(0);
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [regiones, setRegiones] = useState<any[]>([]);

    // Ubicación
    const [latitud, setLatitud] = useState<number>(1.2089); // Mocoa
    const [longitud, setLongitud] = useState<number>(-76.6743);

    // Imagen
    const [imagen, setImagen] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Estado
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ingredienteInputRef = useRef<HTMLInputElement | null>(null);
    const pasoInputRef = useRef<HTMLInputElement | null>(null);

    // Warn if leaving with data
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasAnything =
                title || description || ingredientes.length || pasos.length || imagen;
            if (hasAnything) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [title, description, ingredientes.length, pasos.length, imagen]);

    // Load selects
    useEffect(() => {
        (async () => {
            try {
                const [cats, regs] = await Promise.all([getCategorias(), getRegiones()]);
                setCategorias(cats);
                setRegiones(regs);
                if (cats?.length) setCategoriaId(cats[0].id);
                if (regs?.length) setRegionId(regs[0].id);
            } catch {
                setError('Error al cargar categorías o regiones.');
            }
        })();
    }, []);

    // Helpers
    const addIngrediente = () => {
        const t = ingredienteInput.trim();
        if (!t) return;
        setIngredientes((prev) => [...prev, { id: crypto.randomUUID(), texto: t }]);
        setIngredienteInput('');
        ingredienteInputRef.current?.focus();
    };

    const removeIngrediente = (id: string) => {
        setIngredientes((prev) => prev.filter((i) => i.id !== id));
    };

    const editIngrediente = (id: string, texto: string) => {
        setIngredientes((prev) => prev.map((i) => (i.id === id ? { ...i, texto } : i)));
    };

    const addPaso = () => {
        const t = pasoInput.trim();
        if (!t) return;
        setPasos((prev) => [...prev, { id: crypto.randomUUID(), texto: t }]);
        setPasoInput('');
        pasoInputRef.current?.focus();
    };

    const removePaso = (id: string) => {
        setPasos((prev) => prev.filter((p) => p.id !== id));
    };

    const movePaso = (id: string, dir: 'up' | 'down') => {
        setPasos((prev) => {
            const idx = prev.findIndex((p) => p.id === id);
            if (idx < 0) return prev;
            const newArr = [...prev];
            const newIdx = dir === 'up' ? Math.max(0, idx - 1) : Math.min(prev.length - 1, idx + 1);
            const [item] = newArr.splice(idx, 1);
            newArr.splice(newIdx, 0, item);
            return newArr;
        });
    };

    const editPaso = (id: string, texto: string) => {
        setPasos((prev) => prev.map((p) => (p.id === id ? { ...p, texto } : p)));
    };

    // Validación por paso
    const stepIsValid = useMemo(() => {
        if (step === 0) return !!title.trim() && !!description.trim();
        if (step === 1) return ingredientes.length > 0 && pasos.length > 0;
        if (step === 2) return !!regionId && !!categoriaId;
        if (step === 3) return !!imagen;
        if (step === 4) return typeof latitud === 'number' && typeof longitud === 'number';
        return true;
    }, [step, title, description, ingredientes.length, pasos.length, regionId, categoriaId, imagen, latitud, longitud]);

    const next = () => {
        setError('');
        if (!stepIsValid) {
            setError('Por favor completa los campos requeridos en este paso.');
            return;
        }
        setStep((s) => Math.min(s + 1, steps.length - 1));
    };

    const prev = () => {
        setError('');
        setStep((s) => Math.max(s - 1, 0));
    };

    const validarTodo = () => {
        if (!title || !description) return false;
        if (!ingredientes.length || !pasos.length) return false;
        if (!regionId || !categoriaId) return false;
        if (!imagen) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validarTodo()) {
            setError('❌ Faltan campos por completar.');
            return;
        }
        setIsSubmitting(true);

        // Transforma a lo que espera tu API original
        const ingredientsString = ingredientes.map((i) => i.texto).join(', ');
        const instructionsString = pasos.map((p, idx) => `${idx + 1}. ${p.texto}`).join('\n');

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('ingredients', ingredientsString);
        formData.append('instructions', instructionsString);
        formData.append('regionId', String(regionId));
        formData.append('categoriaId', String(categoriaId));
        formData.append('latitud', String(latitud));
        formData.append('longitud', String(longitud));
        if (imagen) formData.append('imagen', imagen);

        try {
            await crearReceta(formData);
            toast.success(
                user?.role === 'admin'
                    ? 'Receta creada y publicada exitosamente'
                    : 'Receta enviada para aprobación'
            );
            if (user?.role !== 'admin') {
                // Limpia si no es admin
                setTitle('');
                setDescription('');
                setIngredientes([]);
                setPasos([]);
                setIngredienteInput('');
                setPasoInput('');
                setImagen(null);
                setStep(0);
            }
            navigate(user?.role === 'admin' ? '/admin' : '/user');
        } catch (err) {
            console.error(err);
            setError('Error al crear la receta. Verifica los campos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Drag & drop imagen
    const onDrop = (f: File) => {
        if (!f.type.startsWith('image/')) {
            setError('El archivo debe ser una imagen.');
            return;
        }
        setImagen(f);
    };

    const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const progress = Math.round(((step + 1) / steps.length) * 100);

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

                <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="max-w-4xl mx-auto bg-white dark:bg-[#2c2c2c] backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-center text-[#393939] dark:text-white">Crear Receta</h2>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Completa los pasos. Puedes usar <b>Enter</b> para agregar ingredientes/pasos y <b>Ctrl+Enter</b> para enviar.
                            </p>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-coral transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    {steps.map((s, i) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setStep(i)}
                                            className={`px-2 py-1 rounded-md transition ${i === step
                                                    ? 'bg-coral text-white'
                                                    : i < step
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 font-medium text-sm p-2 rounded mb-4">
                                {error}
                            </p>
                        )}

                        {/* STEP 0: Datos */}
                        {step === 0 && (
                            <section className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Título</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ej: Sancocho de gallina"
                                        className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral ${!title && error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Sé descriptivo: nombre del plato y variante.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white">Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Breve historia, contexto y sugerencias de servicio."
                                        className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm resize-y min-h-[90px] focus:ring-2 focus:ring-coral ${!description && error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                    />
                                    <div className="flex justify-end text-xs text-gray-500">
                                        {description.length}/500
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* STEP 1: Contenido */}
                        {step === 1 && (
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ingredientes */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-[#393939] dark:text-white mb-3">Ingredientes</h3>

                                    <div className="flex gap-2">
                                        <input
                                            ref={ingredienteInputRef}
                                            type="text"
                                            value={ingredienteInput}
                                            onChange={(e) => setIngredienteInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addIngrediente();
                                                }
                                            }}
                                            placeholder="Ej: 2 pechugas de pollo"
                                            className={`flex-grow px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-coral ${!ingredientes.length && error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={addIngrediente}
                                            className="px-3 py-2 rounded-md bg-coral text-white shadow hover:brightness-95"
                                        >
                                            Agregar
                                        </button>
                                    </div>

                                    {ingredientes.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {ingredientes.map((i) => (
                                                <span
                                                    key={i.id}
                                                    className="group inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                                                >
                                                    <input
                                                        value={i.texto}
                                                        onChange={(e) => editIngrediente(i.id, e.target.value)}
                                                        className="bg-transparent outline-none w-44 sm:w-56"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIngrediente(i.id)}
                                                        className="opacity-70 group-hover:opacity-100 hover:text-red-600"
                                                        aria-label="Eliminar ingrediente"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-3">
                                            Agrega al menos un ingrediente. Usa Enter para añadir rápidamente.
                                        </p>
                                    )}
                                </div>

                                {/* Pasos */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-[#393939] dark:text-white mb-3">Pasos de preparación</h3>

                                    <div className="flex gap-2">
                                        <input
                                            ref={pasoInputRef}
                                            type="text"
                                            value={pasoInput}
                                            onChange={(e) => setPasoInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addPaso();
                                                }
                                            }}
                                            placeholder="Ej: Sofríe la cebolla hasta dorar"
                                            className={`flex-grow px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-coral ${!pasos.length && error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={addPaso}
                                            className="px-3 py-2 rounded-md bg-coral text-white shadow hover:brightness-95"
                                        >
                                            Agregar
                                        </button>
                                    </div>

                                    {pasos.length > 0 ? (
                                        <ol className="mt-4 space-y-2">
                                            {pasos.map((p, idx) => (
                                                <li
                                                    key={p.id}
                                                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                                >
                                                    <span className="mt-2 h-6 w-6 rounded-full bg-coral text-white text-xs flex items-center justify-center">
                                                        {idx + 1}
                                                    </span>
                                                    <input
                                                        value={p.texto}
                                                        onChange={(e) => editPaso(p.id, e.target.value)}
                                                        className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-coral pb-1"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => movePaso(p.id, 'up')}
                                                            className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            disabled={idx === 0}
                                                            title="Subir"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => movePaso(p.id, 'down')}
                                                            className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            disabled={idx === pasos.length - 1}
                                                            title="Bajar"
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removePaso(p.id)}
                                                            className="text-xs px-2 py-1 rounded-md border hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            title="Eliminar"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-3">
                                            Agrega los pasos uno por uno y reordénalos con ↑/↓.
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* STEP 2: Clasificación */}
                        {step === 2 && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-medium text-sm text-gray-700 dark:text-white">Región</label>
                                    <select
                                        value={regionId}
                                        onChange={(e) => setRegionId(Number(e.target.value))}
                                        className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral"
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
                                        className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-coral"
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs text-gray-500">
                                        Consejo: categoriza bien para que otros usuarios encuentren tu receta fácilmente.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* STEP 3: Imagen */}
                        {step === 3 && (
                            <section className="space-y-4">
                                <label
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDragActive(false);
                                        const f = e.dataTransfer.files?.[0];
                                        if (f) onDrop(f);
                                    }}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition
                    ${dragActive ? 'border-coral bg-coral/5' : 'border-gray-300 dark:border-gray-700'}
                  `}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) onDrop(f);
                                        }}
                                        className="sr-only"
                                    />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Arrastra tu imagen aquí o haz clic para seleccionar</p>
                                        <p className="text-xs text-gray-500">Formatos: JPG/PNG • Tamaño recomendado ≥ 1200px ancho</p>
                                    </div>
                                </label>

                                {imagen && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vista previa:</p>
                                        <img
                                            src={URL.createObjectURL(imagen)}
                                            alt="Vista previa"
                                            className="w-full max-h-[360px] object-cover rounded-xl border"
                                        />
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setImagen(null)}
                                                className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                Quitar imagen
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* STEP 4: Ubicación */}
                        {step === 4 && (
                            <section className="space-y-3">
                                <h3 className="text-lg font-semibold text-[#393939] dark:text-white">Ubicación de la receta</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Haz clic en el mapa para seleccionar el origen geográfico.
                                </p>
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
                            </section>
                        )}

                        {/* Footer nav */}
                        <div className="mt-8 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={prev}
                                disabled={step === 0}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                Atrás
                            </button>

                            {step < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="bg-coral hover:bg-[#e26a4d] text-white px-6 py-2 rounded-lg shadow-md font-medium transition-all"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-coral hover:bg-[#e26a4d] text-white px-6 py-2 rounded-lg shadow-md font-medium transition-all disabled:opacity-50"
                                    onKeyDown={(e) => {
                                        if (e.ctrlKey && e.key === 'Enter') (e.target as HTMLButtonElement).click();
                                    }}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar receta'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearReceta;
