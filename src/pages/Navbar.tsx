import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ShoppingCartIcon, 
  TrashIcon,        
} from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';


import { fetchCart, clearCart, removeCartItem, CartItem } from '../api/cart';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); 
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [cartLoading, setCartLoading] = useState(false);

  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null); 

  if (!user) return null;


  const loadCart = async () => {
    try {
      setCartLoading(true);
      const data = await fetchCart(user.token);
      setCartItems(data.items || []);
    } catch (e) {
      
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
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
    setMenuOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    loadCart();
  }, []);


  useEffect(() => {
    const handler = () => loadCart();
    window.addEventListener('cart:updated', handler);
    return () => window.removeEventListener('cart:updated', handler);
  }, []);

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
      { label: 'Carrito', to: '/cart' },
    ];

  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const cartTotal = cartItems.reduce((acc, it) => acc + (it.quantity * (it.producto?.price || 0)), 0);

  const handleRemoveItem = async (itemId: number) => {
    await removeCartItem(itemId, user.token);
    await loadCart();
  };

  const handleClearCart = async () => {
    await clearCart(user.token);
    await loadCart();
  };

  return (
    <header className="relative z-50 bg-white dark:bg-[#1e1e1e] border-b border-gray-300 shadow-sm px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="flex items-center justify-between">
        
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
                      className={`block px-4 py-2 text-sm text-[#393939] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${location.pathname === item.to ? 'font-semibold border-l-4 border-[#eb8369]' : ''
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

        
        <div className="flex items-center gap-4">
          
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-[#393939] dark:text-white"
              aria-label="Abrir carrito"
              title="Carrito"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-[#eb8369] text-white rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {cartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto bg-white dark:bg-[#2b2b2b] border shadow-xl rounded-xl z-50"
                >
                  <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
                    <span className="font-semibold text-[#393939] dark:text-white">Mi Carrito</span>
                    <button
                      onClick={handleClearCart}
                      className="text-xs text-red-600 hover:underline"
                      disabled={cartItems.length === 0 || cartLoading}
                    >
                      Vaciar
                    </button>
                  </div>

                  <div className="divide-y dark:divide-gray-700">
                    {cartLoading && (
                      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Cargando...</div>
                    )}

                    {!cartLoading && cartItems.length === 0 && (
                      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        Tu carrito está vacío.
                      </div>
                    )}

                    {!cartLoading &&
                      cartItems.map((it) => (
                        <div key={it.id} className="p-3 flex items-center gap-3">
                          <img
                            src={
                              it.producto?.imageUrl
                                ? `${BACKEND_URL}${it.producto.imageUrl}`
                                : 'https://via.placeholder.com/56x56?text=%20'
                            }
                            alt={it.producto?.name || 'Producto'}
                            className="w-14 h-14 rounded object-cover border dark:border-gray-700"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-[#393939] dark:text-white line-clamp-1">
                              {it.producto?.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Cant: {it.quantity} · $
                              {(it.producto?.price || 0).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                            title="Quitar"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>

                  <div className="p-3 border-t dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#393939] dark:text-white font-medium">Total</span>
                      <span className="text-[#393939] dark:text-white font-semibold">
                        ${cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          navigate('/cart');
                        }}
                        className="flex-1 py-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-[#393939] dark:text-white"
                      >
                        Ver carrito
                      </button>
                      <button
                        onClick={() => navigate('/checkout')}
                        disabled={cartItems.length === 0}
                        className="flex-1 py-2 rounded-xl bg-[#eb8369] hover:opacity-90 text-white text-sm"
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="transition transform hover:rotate-180 duration-500 text-[#393939] dark:text-white hover:text-[#eb8369] dark:hover:text-[#eb8369]"
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>

          
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
