import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getRecetaById,
    getCalificacionUsuario,
    calificarReceta,
    getTotalCalificadores,
} from '../api/recetas';
import {
    crearComentario,
    eliminarComentario,
    getComentarios,
} from '../api/comentarios';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import StarRatings from 'react-star-ratings';
import { BACKEND_URL } from '../api/axiosConfig';
import { toast } from 'react-toastify';

interface Comentario {
    id: number;
    contenido: string;
    usuario: {
        id: number;
        username: string;
    };
}

const RecetaDetalle: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [receta, setReceta] = useState<any>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [contenido, setContenido] = useState('');
    const [loading, setLoading] = useState(true);
    const [calificacion, setCalificacion] = useState<number>(0);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [totalCalificadores, setTotalCalificadores] = useState<number>(0);
    const [enviando, setEnviando] = useState(false);

    const cargarDatos = async () => {
        try {
            const data = await getRecetaById(Number(id));
            setReceta(data);
            setCalificacion(data.promedioCalificacion || 0);

            const coms = await getComentarios(Number(id));
            setComentarios(coms);

            const total = await getTotalCalificadores(Number(id));
            setTotalCalificadores(total);

            if (user) {
                const calif = await getCalificacionUsuario(Number(id));
                setUserRating(calif !== null ? Number(calif) : null);
            }
        } catch (err) {
            console.error('Error al cargar datos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id, user]);

    const handleEnviar = async () => {
        if (!contenido.trim()) return;
        setEnviando(true);
        try {
            await crearComentario({ contenido, recetaId: Number(id) });
            setContenido('');
            toast.success('Comentario enviado');
            const nuevos = await getComentarios(Number(id));
            setComentarios(nuevos);
            await cargarDatos();
        } catch (err) {
            toast.error('Error al enviar el comentario');
            console.error(err);
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async (comentarioId: number) => {
        try {
            await eliminarComentario(comentarioId);
            toast.info('Comentario eliminado');
            setComentarios(comentarios.filter((c) => c.id !== comentarioId));
            await cargarDatos();
        } catch (err) {
            toast.error('Error al eliminar el comentario');
        }
    };

    const handleRating = async (valor: number) => {
        try {
            await calificarReceta(Number(id), valor);
            toast.success(`Gracias por calificar con ${valor} ⭐`);
            await cargarDatos();
        } catch (error) {
            toast.error('Error al calificar');
        }
    };

    if (loading) return <><Navbar /><p className="text-center mt-10">Cargando receta...</p></>;
    if (!receta) return <><Navbar /><p className="text-center mt-10 text-red-500">❌ Receta no encontrada.</p></>;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-ivory dark:bg-[#121212] px-4 py-10">
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-[#393939] dark:text-white mb-2">{receta.title}</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{receta.description}</p>

                    <div className="mb-6">
                        <img
                            src={
                                receta.imagenUrl
                                    ? receta.imagenUrl.startsWith('/')
                                        ? `${BACKEND_URL}${receta.imagenUrl}`
                                        : receta.imagenUrl
                                    : '/default.jpg'
                            }
                            alt={receta.title}
                            className="w-full max-h-96 object-cover rounded-lg shadow"
                        />
                    </div>

                    <div className="space-y-2 text-gray-800 dark:text-gray-200 mb-6">
                        <p><strong>📍 Región:</strong> {receta.region?.nombre || 'Sin especificar'}</p>
                        <p><strong>🧂 Ingredientes:</strong></p>
                        <ul className="list-disc list-inside ml-4 text-sm">
                            {receta.ingredients?.split(',').map((ing: string, i: number) => (
                                <li key={i}>{ing.trim()}</li>
                            ))}
                        </ul>
                        <p className="mt-4"><strong>👨‍🍳 Instrucciones:</strong></p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 text-sm whitespace-pre-line">
                            {receta.instructions}
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-6">
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">⭐ Califica esta receta</h3>
                        <div className="flex items-center gap-4">
                            <StarRatings
                                rating={userRating ?? calificacion}
                                starRatedColor="#facc15"
                                starEmptyColor="#e5e7eb"
                                starHoverColor="#fbbf24"
                                numberOfStars={5}
                                changeRating={handleRating}
                                name="calificacion"
                                starDimension="24px"
                                starSpacing="3px"
                            />
                            <span className="text-base font-semibold text-yellow-600">
                                {userRating !== null
                                    ? `Tu calificación: ${userRating.toFixed(1)}`
                                    : `Promedio: ${calificacion.toFixed(1)}`} ({totalCalificadores} votos)
                            </span>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-300 dark:border-gray-700" />

                    <div>
                        <h2 className="text-2xl font-semibold text-[#393939] dark:text-white mb-4">📝 Comentarios</h2>

                        <div className="mb-4">
                            <textarea
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                placeholder="Escribe tu comentario aquí..."
                                maxLength={300}
                                className="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-coral"
                                rows={3}
                            />
                            <div className="text-right text-xs text-gray-500">{contenido.length}/300</div>
                            <button
                                onClick={handleEnviar}
                                disabled={enviando || !contenido.trim()}
                                className="mt-2 bg-coral text-white px-5 py-2 rounded-md hover:bg-[#e26a4d] transition disabled:opacity-50"
                            >
                                {enviando ? 'Enviando...' : 'Enviar comentario'}
                            </button>
                        </div>

                        <ul className="mt-6 divide-y divide-gray-300 dark:divide-gray-700">
                            {comentarios.length === 0 ? (
                                <p className="text-sm text-gray-500">Aún no hay comentarios.</p>
                            ) : (
                                comentarios.map((c) => (
                                    <li
                                        key={c.id}
                                        className="py-3 flex justify-between items-start text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        <div>
                                            <strong className="block text-[#eb8369]">{c.usuario.username}</strong>
                                            <span>{c.contenido}</span>
                                        </div>
                                        {(user?.id === c.usuario.id || user?.role === 'admin') && (
                                            <button
                                                onClick={() => handleEliminar(c.id)}
                                                className="text-red-500 text-xs ml-4 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
};

export default RecetaDetalle;
