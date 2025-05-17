import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Regsiter';
import CrearCategoria from '../pages/CrearCategoria';
import CrearReceta from '../pages/CrearReceta';
import EditarReceta from '../pages/user/EditarReceta';
import MisRecetas from '../pages/user/MisRecetas';
import UserDashboard from '../pages/user/UserDashboard';
import PrivateRoute from './PrivateRoute';

const AppRouter: React.FC = () => {
    const location = useLocation();
    return (
    <AnimatePresence mode="wait"> 
        <Routes location={location} key={location.pathname}>
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
        
    </AnimatePresence>
    );
};

export default AppRouter;
