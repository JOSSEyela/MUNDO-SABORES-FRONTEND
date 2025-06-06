import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Regsiter';
import Home from '../pages/Home/Home';

import CrearReceta from '../pages/CrearReceta';
import EditarReceta from '../pages/user/EditarReceta';
import MisRecetas from '../pages/user/MisRecetas';
import UserDashboard from '../pages/user/UserDashboard';
import CrearProducto from '../pages/user/CrearProducto';
import MisProductos from '../pages/MisProductos';
import EditarProducto from '../pages/user/EditarProducto';
import Perfil from '../pages/Perfil';

import CrearCategoria from '../pages/CrearCategoria';
import AdminProductos from '../pages/admin/AdminProductos';
import RecetaPanel from '../pages/admin/RecetasPanel';
import UsuarioPanel from '../pages/admin/UsuarioPanel';
import RegionesPanel from '../pages/admin/RegionesPanel';

import PrivateRoute from './PrivateRoute';
import RecetaDetalle from '../pages/RecetaDetalle';
import CarritoPage from '../pages/CarritoPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ruta protegida compartida: Ver detalle de receta (con comentarios) */}
      <Route
        path="/recetas/:id"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <RecetaDetalle />
          </PrivateRoute>
        }
      />

      {/* Rutas protegidas para usuarios */}
      <Route
        path="/user"
        element={
          <PrivateRoute role="user">
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/crear"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <CrearReceta />
          </PrivateRoute>
        }
      />
      <Route
        path="/mis-recetas"
        element={
          <PrivateRoute role="user">
            <MisRecetas />
          </PrivateRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <EditarReceta />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <Perfil />
          </PrivateRoute>
        }
      />

      {/* Rutas protegidas para productos (usuarios) */}
      <Route
        path="/crear-producto"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <CrearProducto />
          </PrivateRoute>
        }
      />
      <Route
        path="/mis-productos"
        element={
          <PrivateRoute role="user">
            <MisProductos />
          </PrivateRoute>
        }
      />
      <Route
        path="/editar-producto/:id"
        element={
          <PrivateRoute role={['user', 'admin']}>
            <EditarProducto />
          </PrivateRoute>
        }
      />

      {/* Rutas protegidas para administradores */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <RecetaPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/crear-categoria"
        element={
          <PrivateRoute role="admin">
            <CrearCategoria />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-productos"
        element={
          <PrivateRoute role="admin">
            <AdminProductos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <PrivateRoute role="admin">
            <UsuarioPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/regiones"
        element={
          <PrivateRoute role="admin">
            <RegionesPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="/carrito"
        element={
          <PrivateRoute role="user">
            <CarritoPage />
          </PrivateRoute>
        }
      />


      {/* Ruta 404 */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h1>404 - Página no encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
