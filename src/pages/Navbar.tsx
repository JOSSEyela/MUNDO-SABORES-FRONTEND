import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axiosConfig';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
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
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart');
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Error al cargar el carrito', error);
      }
    };

    if (!user?.role?.includes('admin')) {
      fetchCartItems();
    }
  }, [user]);

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

  return (
    <header className="relative z-50 bg-white dark:bg-[#1e1e1e] border-b border-gray-300 shadow-sm px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            className="btn btn-sm btn-ghost text-[#393939] dark:text-white transition-all duration-300 hover:scale-105"
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>

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

        <div className="flex items-center gap-4">
          {!user?.role?.includes('admin') && (
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="text-[#393939] dark:text-white hover:text-[#eb8369] dark:hover:text-[#eb8369]"
                title="Ver carrito"
              >
                <ShoppingCartIcon className="w-6 h-6" />
              </button>
              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#2b2b2b] border shadow-xl rounded-xl p-4 z-50"
                  >
                    <h2 className="text-sm font-bold mb-2 text-[#393939] dark:text-white">Productos en el carrito</h2>
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
                    ) : (
                      <ul className="max-h-52 overflow-y-auto space-y-1">
                        {cartItems.map((item: any, idx: number) => (
                          <li key={idx} className="text-sm text-[#393939] dark:text-gray-200">
                            - {item.producto.nombre} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => navigate('/carrito')}
                      className="mt-4 w-full bg-[#eb8369] text-white py-1.5 rounded hover:bg-[#d56c55] transition-all"
                    >
                      Ir al carrito
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="transition transform hover:rotate-180 duration-500 text-[#393939] dark:text-white hover:text-[#eb8369] dark:hover:text-[#eb8369]"
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>

          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!profileOpen)} className="avatar" title="Ver perfil">
              <div className={`w-10 rounded-full ring ${ringColor} ring-offset-base-100 ring-offset-2`}>
                <img src={avatarUrl} alt="Avatar del usuario" loading="lazy" className="object-cover w-10 h-10 rounded-full" />
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
