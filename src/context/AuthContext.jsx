import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authApi } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener sesión inicial
        const getInitialSession = async () => {
            try {
                const session = await authApi.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error obteniendo sesión:', error);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = authApi.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { user: authUser } = await authApi.signIn(email, password);
        setUser(authUser);
        return authUser;
    };

    const signOut = async () => {
        await authApi.signOut();
        setUser(null);
    };

    const value = {
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
