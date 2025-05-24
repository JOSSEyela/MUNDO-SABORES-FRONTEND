import React, { useEffect, useState } from 'react';
import { getRegiones, crearRegion, eliminarRegion } from '../../api/regiones';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fondo from '../../assets/images/fondo-recetas.jpg'; 

const RegionesPanel: React.FC = () => {
    const [regiones, setRegiones] = useState([]);
    const [nuevaRegion, setNuevaRegion] = useState('');

    const cargarRegiones = async () => {
        try {
            const data = await getRegiones();
            setRegiones(data);
        } catch {
            toast.error('❌ Error al cargar las regiones');
        }
    };

    useEffect(() => {
        cargarRegiones();
    }, []);

    const handleCrear = async () => {
        if (!nuevaRegion.trim()) return;

        try {
            await crearRegion({ nombre: nuevaRegion });
            toast.success('✅ Región creada correctamente');
            setNuevaRegion('');
            cargarRegiones();
        } catch (err: any) {
            const msg = err.response?.data?.message || '❌ Error al crear región';
            toast.error(msg);
        }
    };

    const handleEliminar = async (id: number) => {
        const confirmar = window.confirm('¿Eliminar esta región?');
        if (!confirmar) return;

        try {
            await eliminarRegion(id);
            toast.success('🗑️ Región eliminada');
            cargarRegiones();
        } catch {
            toast.error('❌ Error al eliminar la región');
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="relative min-h-screen bg-gradient-to-br from-[#fefcec] via-white to-[#fefcec] dark:from-[#1a1a1a] dark:via-[#111] dark:to-[#1a1a1a] transition-colors">
                <div className="absolute inset-0 -z-10">
                    <img
                        src={fondo}
                        alt="fondo regiones"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold text-[#393939] dark:text-white text-center">
                        🌍 Gestión de Regiones
                    </h1>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={nuevaRegion}
                            onChange={(e) => setNuevaRegion(e.target.value)}
                            placeholder="Nueva región"
                            className="px-4 py-2 border rounded w-full dark:bg-[#2b2b2b] dark:text-white dark:border-gray-600"
                        />
                        <button
                            onClick={handleCrear}
                            className="bg-coral text-white px-4 py-2 rounded"
                        >
                            ➕ Crear
                        </button>
                    </div>

                    <ul className="space-y-2">
                        {regiones.map((region: any) => (
                            <li
                                key={region.id}
                                className="flex justify-between items-center bg-white dark:bg-[#2c2c2c] p-3 rounded shadow border border-gray-200 dark:border-gray-700"
                            >
                                <span className="text-[#393939] dark:text-white">
                                    {region.nombre}
                                </span>
                                <button
                                    onClick={() => handleEliminar(region.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    🗑️ Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default RegionesPanel;
