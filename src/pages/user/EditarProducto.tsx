import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductoById, actualizarProducto } from '../../api/productos';
import { getRegiones } from '../../api/regiones';
import Navbar from '../Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import fondoDecorativo from '../../assets/images/fondo-recetas.jpg'; 


const EditarProducto: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        regionId: '',
        stock: '',
    });
    const [regiones, setRegiones] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const producto = await getProductoById(Number(id));
                setFormData({
                    name: producto.name,
                    description: producto.description,
                    price: producto.price.toString(),
                    regionId: producto.region?.id || '',
                    stock: producto.stock?.toString() || '',
                });

                const regionesData = await getRegiones();
                setRegiones(regionesData);
            } catch (err) {
                setError('Error al cargar producto o regiones');
            }
        };
        cargarDatos();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const parsedPrice = parseFloat(formData.price);
        const parsedStock = parseInt(formData.stock);

        if (parsedPrice <= 0 || parsedStock < 0) {
            toast.error('Verifica que el precio sea mayor a 0 y el stock no sea negativo');
            return;
        }

        try {
            await actualizarProducto(Number(id), {
                name: formData.name,
                description: formData.description,
                price: parsedPrice,
                regionId: Number(formData.regionId),
                stock: parsedStock,
            });

            toast.success('✅ Producto actualizado exitosamente', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                theme: 'colored'
            });

            setTimeout(() => {
                navigate(user?.role === 'admin' ? '/admin-productos' : '/mis-productos');
            }, 1000);
        } catch (err) {
            console.error(err);
            setError('Error al actualizar el producto');
            toast.error('❌ No se pudo actualizar el producto', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                theme: 'colored'
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
                        src={fondoDecorativo}
                        alt="Decoración de fondo"
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                </div>

                <div className="relative z-10 max-w-xl mx-auto bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-[#393939] dark:text-white mb-6 text-center">
                        ✏️ Editar Producto
                    </h2>

                    {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nombre */}
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-gray-200">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-gray-200">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                            />
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-gray-200">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-gray-200">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min={0}
                                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                            />
                        </div>

                        {/* Región */}
                        <div>
                            <label className="block font-medium text-[#393939] dark:text-gray-200">Región</label>
                            <select
                                name="regionId"
                                value={formData.regionId}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eb8369] dark:bg-[#1f1f1f] dark:text-white dark:border-gray-600"
                            >
                                <option value="">Seleccione una región</option>
                                {regiones.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-center pt-2">
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

export default EditarProducto;
