import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const profileRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setAvatarTimestamp(Date.now());
  }, [user.avatarUrl]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRoutes = [
    { label: 'Inicio', to: '/user' },
    { label: 'Crear Receta', to: '/crear' },
    { label: 'Mis Recetas', to: '/mis-recetas' },
    { label: 'Crear Producto', to: '/crear-producto' },
    { label: 'Mis Productos', to: '/mis-productos' },
  ];

  const adminRoutes = [
    { label: 'Inicio Admin', to: '/admin' },
    { label: 'Crear Receta', to: '/crear' },
    { label: 'Crear Categoría', to: '/crear-categoria' },
    { label: 'Gestión de Usuarios', to: '/admin/usuarios' },
    { label: 'Aprobar Productos', to: '/admin-productos' },
  ];

  const avatarUrl = user.avatarUrl
    ? `http://localhost:8080${user.avatarUrl}?t=${avatarTimestamp}`
    : 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png';

  return (
    <header className="relative z-50 bg-white border-b border-gray-300 shadow-sm px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-sm btn-ghost text-[#393939]">
              {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            {menuOpen && (
              <ul className="absolute left-0 mt-2 w-60 bg-white border shadow-lg rounded-xl py-2 z-50 space-y-1">
                {(user.role === 'admin' ? adminRoutes : userRoutes).map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-[#393939]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <div>
              <span className="text-lg font-bold text-[#393939] block">Un Mundo de Sabores</span>
              <span className="text-xs text-gray-500">
                {user.role === 'admin' ? 'Panel Admin' : 'Panel Usuario'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!profileOpen)} className="avatar">
            <div className="w-10 rounded-full">
              <img src={avatarUrl} alt="avatar" className="object-cover w-10 h-10 rounded-full" />
            </div>
          </button>

          {profileOpen && (
            <ul className="absolute right-0 mt-2 w-52 bg-white border shadow-lg rounded-xl py-2 z-50 space-y-1">
              <li className="px-4 py-2 font-semibold text-[#393939]">
                {user.username} <br />
                <span className="text-xs text-gray-500">{user.role}</span>
              </li>
              <hr />
              <li>
                <Link to="/perfil" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/donaciones" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Donaciones
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
