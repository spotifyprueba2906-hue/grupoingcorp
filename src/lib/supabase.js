import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// API DE PROYECTOS
// =============================================
export const projectsApi = {
  // Obtener todos los proyectos con sus imágenes
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (
          id,
          image_url,
          display_order
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Obtener un proyecto por ID con sus imágenes
  async getById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (
          id,
          image_url,
          display_order
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener proyectos destacados
  async getFeatured() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (
          id,
          image_url,
          display_order
        )
      `)
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

  // Eliminar proyecto (las imágenes se eliminan en cascada)
  async delete(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Contar proyectos
  async count() {
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }
};

// =============================================
// API DE IMÁGENES DE PROYECTOS
// =============================================
export const projectImagesApi = {
  // Agregar imagen a un proyecto
  async add(projectId, imageUrl, displayOrder = 0) {
    const { data, error } = await supabase
      .from('project_images')
      .insert([{
        project_id: projectId,
        image_url: imageUrl,
        display_order: displayOrder
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener imágenes de un proyecto
  async getByProject(projectId) {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Eliminar imagen
  async delete(imageId) {
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  },

  // Actualizar orden de imagen
  async updateOrder(imageId, newOrder) {
    const { data, error } = await supabase
      .from('project_images')
      .update({ display_order: newOrder })
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================
// API DE MENSAJES DE CONTACTO
// =============================================
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
  },

  // Contar mensajes
  async count() {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },

  // Contar mensajes sin leer
  async countUnread() {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  // Enviar notificación a Telegram
  async notifyTelegram(messageData) {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/notify-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify(messageData)
      });
      return response.ok;
    } catch (error) {
      console.error('Error enviando notificación Telegram:', error);
      return false;
    }
  }
};

// =============================================
// API DE VISITAS DEL SITIO
// =============================================
export const visitsApi = {
  // Registrar una visita
  async track(pagePath) {
    try {
      const visitorId = this.getVisitorId();
      const { error } = await supabase
        .from('site_visits')
        .insert([{
          page_path: pagePath,
          visitor_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
        }]);

      if (error) console.error('Error tracking visit:', error);
    } catch (err) {
      console.error('Error tracking visit:', err);
    }
  },

  // Obtener o crear ID de visitante único
  getVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  },

  // Contar visitas totales
  async countTotal() {
    const { count, error } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  },

  // Contar visitantes únicos (hoy)
  async countUniqueToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('site_visits')
      .select('visitor_id')
      .gte('created_at', today.toISOString());

    if (error) throw error;
    const uniqueVisitors = new Set(data?.map(v => v.visitor_id) || []);
    return uniqueVisitors.size;
  },

  // Contar visitas de los últimos 7 días
  async countLast7Days() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (error) throw error;
    return count || 0;
  }
};

// =============================================
// API DE ESTADÍSTICAS (DASHBOARD)
// =============================================
export const statsApi = {
  async getDashboardStats() {
    const [projectsCount, messagesCount, unreadCount, visitsTotal, visitsTodayUnique] = await Promise.all([
      projectsApi.count(),
      messagesApi.count(),
      messagesApi.countUnread(),
      visitsApi.countTotal().catch(() => 0),
      visitsApi.countUniqueToday().catch(() => 0)
    ]);

    return {
      projects: projectsCount,
      messages: messagesCount,
      unreadMessages: unreadCount,
      visits: visitsTotal,
      visitsToday: visitsTodayUnique
    };
  }
};

// =============================================
// API DE STORAGE (IMÁGENES)
// =============================================
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
    if (!url) return true;
    const path = url.split('/').slice(-2).join('/');
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) throw error;
    return true;
  }
};

// =============================================
// API DE CONFIGURACIÓN DEL SITIO
// =============================================
export const siteSettingsApi = {
  // Obtener todas las configuraciones
  async getAll() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    // Convertir array a objeto para fácil acceso
    const settings = {};
    data?.forEach(item => {
      settings[item.key] = item.value;
    });
    return settings;
  },

  // Obtener una configuración específica
  async get(key) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.value;
  },

  // Actualizar o crear una configuración (upsert)
  async update(key, value) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar múltiples configuraciones
  async updateMany(settings) {
    const updates = Object.entries(settings).map(([key, value]) =>
      this.update(key, value)
    );
    return Promise.all(updates);
  }
};

// =============================================
// API DE AUTENTICACIÓN
// =============================================
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
