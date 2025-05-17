import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 bg-white border-b border-gray-300 shadow-sm px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="h-16 w-auto" />
          <span className="text-2xl font-extrabold text-[#393939]">
            {user.role === 'admin' ? 'Panel Admin' : 'Panel Usuario'}
          </span>
        </div>

        {/* Botón hamburguesa (visible en móviles) */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XMarkIcon className="h-6 w-6 text-[#393939]" /> : <Bars3Icon className="h-6 w-6 text-[#393939]" />}
        </button>

        {/* Navegación horizontal para pantallas grandes */}
        <nav className="hidden sm:flex items-center gap-6">
          {user.role === 'user' && (
            <>
              <Link to="/user" className="nav-link">Inicio</Link>
              <Link to="/crear" className="nav-link">Crear Receta</Link>
              <Link to="/mis-recetas" className="nav-link">Mis Recetas</Link>
              <Link to="/crear-producto" className="nav-link">Crear Producto</Link>
              <Link to="/mis-productos" className="nav-link">Mis Productos</Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link to="/admin" className="nav-link">Inicio Admin</Link>
              <Link to="/admin-productos" className="nav-link">Aprobar Productos</Link>
            </>
          )}

          {/* Menú desplegable perfil */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-link">
              Perfil ▾
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border py-2 z-50">
                <Link to="/perfil" className="block px-4 py-2 text-sm hover:bg-gray-100">Ver perfil</Link>
                <Link to="/donaciones" className="block px-4 py-2 text-sm hover:bg-gray-100">Donaciones</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-b"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Menú hamburguesa desplegable para móviles */}
      {menuOpen && (
        <div className="sm:hidden mt-4 bg-white border-t border-gray-200 pt-4">
          <div className="flex flex-col gap-3">
            {user.role === 'user' && (
              <>
                <Link to="/user" className="mobile-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
                <Link to="/crear" className="mobile-link" onClick={() => setMenuOpen(false)}>Crear Receta</Link>
                <Link to="/mis-recetas" className="mobile-link" onClick={() => setMenuOpen(false)}>Mis Recetas</Link>
                <Link to="/crear-producto" className="mobile-link" onClick={() => setMenuOpen(false)}>Crear Producto</Link>
                <Link to="/mis-productos" className="mobile-link" onClick={() => setMenuOpen(false)}>Mis Productos</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Inicio Admin</Link>
                <Link to="/admin-productos" className="mobile-link" onClick={() => setMenuOpen(false)}>Aprobar Productos</Link>
              </>
            )}
            <hr />
            <Link to="/perfil" className="mobile-link" onClick={() => setMenuOpen(false)}>Ver perfil</Link>
            <Link to="/donaciones" className="mobile-link" onClick={() => setMenuOpen(false)}>Donaciones</Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-semibold text-white bg-red-500 hover:bg-red-600 py-2 px-4 mt-2 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;