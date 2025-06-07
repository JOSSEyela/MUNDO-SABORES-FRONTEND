import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setAvatarTimestamp(Date.now());
  }, [user.avatarUrl]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = user.avatarUrl
    ? `${BACKEND_URL}${user.avatarUrl}?t=${avatarTimestamp}`
    : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const currentPage = location.pathname
    .split('/')
    .filter(Boolean)
    .map(word => word.replace(/-/g, ' '))
    .join(' / ')
    .replace(/^\w/, c => c.toUpperCase());

  const ringColor = user.role === 'admin' ? 'ring-red-400' : 'ring-green-400';

  const rutas = user.role === 'admin'
    ? [
        { label: 'Inicio Admin', to: '/admin' },
        { label: 'Crear Receta', to: '/crear' },
        { label: 'Crear Categoría', to: '/crear-categoria' },
        { label: 'Gestión de Usuarios', to: '/admin/usuarios' },
        { label: 'Aprobar Productos', to: '/admin-productos' },
        { label: 'Crear Producto', to: '/crear-producto' },
        { label: 'Gestión de Regiones', to: '/admin/regiones' },
      ]
    : [
        { label: 'Inicio', to: '/user' },
        { label: 'Crear Receta', to: '/crear' },
        { label: 'Mis Recetas', to: '/mis-recetas' },
        { label: 'Crear Producto', to: '/crear-producto' },
        { label: 'Mis Productos', to: '/mis-productos' },
        // Carrito removido aquí
      ];

  return (
    <header className="relative z-50 bg-white dark:bg-[#1e1e1e] border-b border-gray-300 shadow-sm px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Menú lateral y logo */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            className="text-[#393939] dark:text-white"
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.ul
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                className="absolute left-0 top-12 w-64 bg-white dark:bg-[#2b2b2b] border shadow-xl rounded-xl py-2 z-50 space-y-1"
              >
                {rutas.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2 text-sm text-[#393939] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                        location.pathname === item.to ? 'font-semibold border-l-4 border-[#eb8369]' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(user.role === 'admin' ? '/admin' : '/user')}
          >
            <img src={logo} alt="Logo de la app" className="h-12 w-auto" />
            <div>
              <span className="text-xl font-serif font-bold text-[#393939] dark:text-white tracking-tight block">
                Un Mundo de Sabores
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.role === 'admin' ? 'Panel Admin' : 'Panel Usuario'}
              </span>
            </div>
          </div>
        </div>

        {/* Iconos derecho: tema, perfil */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="transition transform hover:rotate-180 duration-500 text-[#393939] dark:text-white hover:text-[#eb8369] dark:hover:text-[#eb8369]"
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>

          {/* Perfil del usuario */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!profileOpen)} className="avatar">
              <div className={`w-10 rounded-full ring ${ringColor} ring-offset-base-100 ring-offset-2`}>
                <img src={avatarUrl} alt="Avatar" className="object-cover w-10 h-10 rounded-full" />
              </div>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#2b2b2b] border shadow-xl rounded-xl py-2 z-50 space-y-1"
                >
                  <li className="px-4 py-2 font-semibold text-[#393939] dark:text-white">
                    {user.username}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
                  </li>
                  <hr className="dark:border-gray-700" />
                  <li>
                    <Link
                      to="/perfil"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-[#393939] dark:text-white"
                    >
                      <UserCircleIcon className="w-4 h-4" /> Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mt-2 ml-2 sm:ml-4">
        <nav className="text-sm text-gray-600 dark:text-gray-300 breadcrumbs">
          <ul className="flex space-x-2 items-center">
            <li>
              <Link to={user.role === 'admin' ? '/admin' : '/user'} className="hover:text-[#eb8369] font-medium flex items-center">
                <ChevronRightIcon className="w-4 h-4 mr-1" /> Inicio
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">›</li>
            <li className="font-semibold text-[#393939] dark:text-white">{currentPage || 'Dashboard'}</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
