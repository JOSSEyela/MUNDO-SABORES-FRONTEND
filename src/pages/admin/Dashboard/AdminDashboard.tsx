import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../context/AuthContext';
import CategoriaPanel from '../CategoriaPanel';
import UsuarioPanel from '../UsuarioPanel';
import RecetaPanel from '../RecetasPanel';
import Navbar from '../../Navbar';
import '../../../styles/AdminPanel.css';

const AdminDashboard: React.FC = () => {
    const [tab, setTab] = useState<'recetas' | 'categorias' | 'usuarios'>('recetas');
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fefcec] via-white to-[#fefcec]">
            <Navbar />

            {/* Menú hamburguesa responsivo */}
            <div className="flex items-center justify-between sm:justify-start px-4 sm:px-8 py-4 border-b border-gray-300 bg-white shadow-md backdrop-blur-sm">
                <Menu as="div" className="relative">
                    <MenuButton
                        className="flex items-center gap-2 text-base sm:text-lg font-semibold text-[#393939] hover:text-[#eb8369] transition focus:outline-none"
                        aria-label="Menú de navegación del panel"
                    >
                        <Bars3Icon className="w-6 h-6" />
                        Menú
                    </MenuButton>

                    <MenuItems className="absolute left-0 mt-2 w-56 sm:w-60 bg-white shadow-2xl rounded-xl py-2 z-50 border border-gray-200 animate-fadeIn">
                        {['recetas', 'categorias', 'usuarios'].map((item) => (
                            <MenuItem key={item}>
                                {({ active }) => (
                                    <button
                                        onClick={() => setTab(item as typeof tab)}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium rounded transition focus:outline-none ${
                                            active ? 'bg-[#eb8369]/10 text-[#eb8369]' : 'text-[#393939]'
                                        }`}
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </button>
                                )}
                            </MenuItem>
                        ))}

                        {user?.role === 'admin' && (
                            <>
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => navigate('/crear')}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium rounded transition focus:outline-none ${
                                                active ? 'bg-[#eb8369]/10 text-[#eb8369]' : 'text-[#393939]'
                                            }`}
                                        >
                                            ➕ Crear Receta
                                        </button>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ active }) => (
                                        <button
                                            onClick={() => navigate('/crear-categoria')}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium rounded transition focus:outline-none ${
                                                active ? 'bg-[#eb8369]/10 text-[#eb8369]' : 'text-[#393939]'
                                            }`}
                                        >
                                            📂️ Crear Categoría
                                        </button>
                                    )}
                                </MenuItem>
                            </>
                        )}
                    </MenuItems>
                </Menu>
            </div>

            {/* Panel dinámico */}
            <main className="p-4 sm:p-6 max-w-6xl mx-auto" role="region" aria-label="Panel de administración">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-[#393939] mb-6 sm:mb-10 transition-all duration-300">
                    
                </h1>

                <section className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-10 transition-all duration-300 hover:shadow-xl animate-fadeIn">
                    {tab === 'recetas' && <RecetaPanel />}
                    {tab === 'categorias' && <CategoriaPanel />}
                    {tab === 'usuarios' && <UsuarioPanel />}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;