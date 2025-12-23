-- =============================================
-- EJECUTAR EN SQL EDITOR DE SUPABASE
-- =============================================

-- Tabla para múltiples imágenes por proyecto
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Public read project images" ON project_images 
  FOR SELECT USING (true);

CREATE POLICY "Auth users manage project images" ON project_images 
  FOR ALL USING (auth.role() = 'authenticated');

-- Índice para mejor rendimiento
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
