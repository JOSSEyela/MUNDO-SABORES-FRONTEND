import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Regsiter';
import Home from '../pages/Home/Home';

import CrearReceta from '../pages/CrearReceta';
import EditarReceta from '../pages/user/EditarReceta';
import MisRecetas from '../pages/user/MisRecetas';
import UserDashboard from '../pages/user/UserDashboard';
import PrivateRoute from './PrivateRoute';

import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard';
import CrearCategoria from '../pages/CrearCategoria';


import AdminProductos from '../pages/admin/AdminProductos';
import MisProductos from '../pages/MisProductos';
import CrearProducto from '../pages/user/CrearProducto';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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

      {/* Rutas de productos para usuarios */}
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

      {/* Rutas protegidas para admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
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

      {/* Ruta 404 */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: 'center' }}>
            <h1>404 - Página no encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;