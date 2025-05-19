import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Navbar from '../pages/Navbar';
import fondoRecetas from '../assets/images/fondo-recetas.jpg';

const CrearCategoria: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (mensaje || error) {
            const timer = setTimeout(() => {
                setMensaje('');
                setError('');
            }, 4000); // 4 segundos
            return () => clearTimeout(timer);
        }
    }, [mensaje, error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!nombre.trim()) {
            setError('El nombre de la categoría es obligatorio');
            return;
        }

        try {
            await axios.post('/categorias', { nombre });
            setMensaje('Categoría creada exitosamente');
            setNombre('');
        } catch (err) {
            setError('Error al crear la categoría');
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />

            {/* Alertas flotantes no bloqueantes */}
            <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
                {error && (
                    <div className="alert alert-warning alert-soft shadow-lg flex items-center gap-3 text-sm w-80 animate-fade-in pointer-events-auto transition-all duration-300" role="alert">
                        <span className="icon-[tabler--alert-triangle] size-5 shrink-0"></span>
                        <p><span className="font-semibold">Atención:</span> {error}</p>
                    </div>
                )}
                {mensaje && (
                    <div className="alert alert-success alert-soft shadow-lg flex items-center gap-3 text-sm w-80 animate-fade-in pointer-events-auto transition-all duration-300" role="alert">
                        <span className="icon-[tabler--circle-check] size-5 shrink-0"></span>
                        <p><span className="font-semibold">Éxito:</span> {mensaje}</p>
                    </div>
                )}
            </div>

            {/* Fondo y formulario */}
            <div className="relative min-h-screen bg-ivory flex items-center justify-center px-4 py-10">
                <div className="absolute inset-0 z-0">
                    <img
                        src={fondoRecetas}
                        alt="fondo recetas"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in"
                >
                    <h2 className="text-3xl font-bold text-center text-[#393939]">Crear Categoría</h2>

                    <div>
                        <label className="block text-[#393939] font-semibold mb-1">Nombre de la categoría:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Postres"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coral"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-coral hover:bg-peach text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Crear
                    </button>
                </form>
            </div>
        </>
    );
};

export default CrearCategoria;
