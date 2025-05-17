import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';
import '../styles/NavbarDropdown.css'; // Asegúrate de importar este archivo

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="relative z-50 bg-white border-b border-gray-300 shadow-sm px-4 sm:px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Logo y título */}
                <div className="w-full sm:w-auto flex justify-center sm:justify-start items-center gap-4">
                    <img src={logo} alt="Logo" className="h-20 w-auto" />
                    <span className="text-3xl font-extrabold text-[#393939] text-center">
                        Panel Admin
                    </span>
                </div>

                {/* Navegación + Menú de perfil textual */}
                <div className="relative flex items-center gap-6 z-50" ref={dropdownRef}>
                    {user.role === 'user' && (
                        <>
                            <Link to="/user" className="text-[#393939] hover:text-[#eb8369] font-medium">
                                Inicio
                            </Link>
                            <Link to="/crear" className="text-[#393939] hover:text-[#eb8369] font-medium">
                                Crear Receta
                            </Link>
                            <Link to="/mis-recetas" className="text-[#393939] hover:text-[#eb8369] font-medium">
                                Mis Recetas
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="text-[#393939] font-medium hover:text-[#eb8369] focus:outline-none"
                    >
                        Perfil ▾
                    </button>

                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <div className="px-4 py-2">
                                <Link
                                    to="/perfil"
                                    className="block text-sm font-medium text-[#393939] hover:text-[#eb8369] mb-2"
                                >
                                    Ver perfil
                                </Link>
                                <Link
                                    to="/donaciones"
                                    className="block text-sm font-medium text-[#393939] hover:text-[#eb8369] mb-2"
                                >
                                    Donaciones
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition py-2 px-4 rounded mt-2"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
