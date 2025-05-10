import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    username: string;
    rol: string;
    exp: number; // tiempo de expiración en UNIX timestamp
}

interface AuthContextType {
    user: { role: string; username: string } | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ role: string; username: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = jwtDecode<DecodedToken>(token);
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp < now) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({
                        role: payload.rol,
                        username: payload.username
                    });
                }
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const payload = jwtDecode<DecodedToken>(token);
        setUser({
            role: payload.rol,
            username: payload.username
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

