# Grupo Ingcor - Website

Sitio web profesional para **Grupo Ingcor**, empresa de mantenimiento integral de edificios.

## 🚀 Características

- ✅ Página principal con diseño moderno
- ✅ Galería de proyectos con filtros
- ✅ Formulario de contacto funcional
- ✅ Portal de administración protegido
- ✅ Gestión de proyectos (CRUD)
- ✅ Gestión de mensajes de contacto
- ✅ Diseño responsive
- ✅ SEO optimizado

## 🛠️ Tecnologías

- **Frontend:** React 18 + Vite
- **Estilos:** CSS Variables + CSS Modules
- **Backend:** Supabase (PostgreSQL)
- **Iconos:** Lucide React
- **Hosting:** Vercel (recomendado)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## ⚙️ Configuración de Supabase

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ejecutar el SQL de abajo en el SQL Editor
4. Copiar `.env.example` a `.env.local`
5. Agregar las credenciales de Supabase

### SQL para crear las tablas:

```sql
-- Tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes de contacto
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para proyectos
CREATE POLICY "Lectura pública de proyectos" ON projects 
  FOR SELECT USING (true);

CREATE POLICY "Admin puede todo en proyectos" ON projects 
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para mensajes
CREATE POLICY "Usuarios pueden enviar mensajes" ON contact_messages 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin puede ver/editar mensajes" ON contact_messages 
  FOR ALL USING (auth.role() = 'authenticated');
```

### Configurar Storage para imágenes:

1. Ir a Storage en Supabase
2. Crear bucket llamado `images`
3. Configurar como público

## 🔐 Crear usuario administrador

1. Ir a Authentication en Supabase
2. Users → Add user
3. Agregar email y contraseña

## 🚀 Deploy en Vercel

1. Subir proyecto a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Importar repositorio
4. Agregar variables de entorno
5. Deploy!

## 📁 Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables
├── context/         # Contextos de React (Auth)
├── lib/             # Configuración de Supabase
├── pages/           # Páginas
│   ├── Home.jsx
│   └── admin/       # Portal de administración
└── hooks/           # Custom hooks
```

## 📞 Contacto

Desarrollado para **Grupo Ingcor**
