-- =============================================
-- TABLA DE VISITAS DEL SITIO
-- =============================================
-- Ejecutar este SQL en el Editor SQL de Supabase

-- Crear tabla para tracking de visitas
CREATE TABLE IF NOT EXISTS site_visits (
    id BIGSERIAL PRIMARY KEY,
    page_path VARCHAR(255) NOT NULL,
    visitor_id VARCHAR(255),
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON site_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_path ON site_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON site_visits(visitor_id);

-- Habilitar Row Level Security
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay (para evitar errores en re-ejecución)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON site_visits;
DROP POLICY IF EXISTS "Allow authenticated reads" ON site_visits;

-- Política: Permitir inserción anónima (para tracking desde el sitio público)
CREATE POLICY "Allow anonymous inserts" ON site_visits
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden leer (para el dashboard admin)
CREATE POLICY "Allow authenticated reads" ON site_visits
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Otorgar permisos al rol anon para insertar
GRANT INSERT ON site_visits TO anon;

-- Otorgar permisos al rol authenticated para leer
GRANT SELECT ON site_visits TO authenticated;

-- Otorgar uso de la secuencia para el id
GRANT USAGE, SELECT ON SEQUENCE site_visits_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE site_visits_id_seq TO authenticated;
