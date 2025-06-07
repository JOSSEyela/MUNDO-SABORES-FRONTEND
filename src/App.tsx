import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // ✅ importa el AuthProvider

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> {/* ✅ Envolver primero */}
        <CartProvider>
          <div className="min-h-screen bg-[#fefcec] text-[#393939] dark:bg-[#121212] dark:text-white transition-colors duration-300">
            <AppRouter />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
