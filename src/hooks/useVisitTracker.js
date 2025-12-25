import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { visitsApi } from '../lib/supabase';

/**
 * Hook para registrar visitas automáticamente cuando el usuario navega
 * Solo registra una vez por ruta por sesión para evitar duplicados
 */
export const useVisitTracker = () => {
    const location = useLocation();
    const tracked = useRef(new Set());

    useEffect(() => {
        const path = location.pathname;

        // Evitar tracking de rutas admin
        if (path.startsWith('/admin')) {
            return;
        }

        // Evitar tracking duplicado en la misma sesión
        if (!tracked.current.has(path)) {
            tracked.current.add(path);
            visitsApi.track(path);
        }
    }, [location.pathname]);
};

export default useVisitTracker;
