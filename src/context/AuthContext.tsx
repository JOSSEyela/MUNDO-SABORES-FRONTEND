import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: number;
    username: string;
    rol: string;
    exp: number;
}

interface AuthUser {
    id: number;
    username: string;
    role: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUserAvatar: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedAvatar = localStorage.getItem('avatarUrl');

        if (token) {
            try {
                const payload = jwtDecode<DecodedToken>(token);
                const now = Math.floor(Date.now() / 1000);

                if (payload.exp < now) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('avatarUrl');
                    setUser(null);
                } else {
                    setUser({
                        id: payload.sub,
                        username: payload.username,
                        role: payload.rol,
                        avatarUrl: storedAvatar || undefined,
                    });
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('avatarUrl');
                setUser(null);
            }
        }

        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const payload = jwtDecode<DecodedToken>(token);

        setUser({
            id: payload.sub,
            username: payload.username,
            role: payload.rol,
            avatarUrl: localStorage.getItem('avatarUrl') || undefined,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('avatarUrl');
        setUser(null);
    };

    const setUserAvatar = (avatarUrl: string) => {
        localStorage.setItem('avatarUrl', avatarUrl);
        if (user) {
            setUser({ ...user, avatarUrl });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, setUserAvatar }}>
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
