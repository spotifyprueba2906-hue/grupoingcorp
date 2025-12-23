import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// IMPORTANTE: Reemplazar con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funciones de utilidad para proyectos
export const projectsApi = {
  // Obtener todos los proyectos
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Obtener proyectos destacados
  async getFeatured() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Crear proyecto
  async create(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar proyecto
  async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar proyecto
  async delete(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Funciones de utilidad para mensajes de contacto
export const messagesApi = {
  // Enviar mensaje de contacto
  async create(message) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener todos los mensajes (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Marcar como leído
  async markAsRead(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar mensaje
  async delete(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Funciones de storage para imágenes
export const storageApi = {
  // Subir imagen
  async uploadImage(file, folder = 'projects') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  // Eliminar imagen
  async deleteImage(url) {
    const path = url.split('/').slice(-2).join('/');
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) throw error;
    return true;
  }
};

// Funciones de autenticación
export const authApi = {
  // Login
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // Obtener sesión actual
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
