-- =============================================
-- EJECUTAR EN SQL EDITOR DE SUPABASE
-- Configuración del sitio (contacto, hero, etc.)
-- =============================================

-- Tabla para configuración del sitio
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Public read site settings" ON site_settings 
  FOR SELECT USING (true);

CREATE POLICY "Auth users manage site settings" ON site_settings 
  FOR ALL USING (auth.role() = 'authenticated');

-- Insertar configuraciones iniciales
INSERT INTO site_settings (key, value) VALUES
  ('hero_image', ''),
  ('contact_phone', '+52 55 1234 5678'),
  ('contact_email', 'contacto@grupoingcor.com'),
  ('contact_address', 'Ciudad de México, CDMX'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_linkedin', ''),
  ('social_twitter', '');
