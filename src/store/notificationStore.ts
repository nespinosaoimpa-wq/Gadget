import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export type NotificationType = 'ALERTA' | 'TAREA' | 'ALLANAMIENTO' | 'SISTEMA';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  read: boolean;
  created_at: string;
  metadata?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notif: Partial<Notification>) => void;
  subscribeToNotifications: () => () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      set({ 
        notifications: data || [], 
        unreadCount: (data || []).filter(n => !n.read).length,
        loading: false 
      });
    } catch (err) {
      set({ loading: false });
      // Demo notifications
      if (get().notifications.length === 0) {
        const demo = [
          { id: '1', type: 'ALERTA', title: 'Detección Facial', message: 'Posible coincidencia de "Toti" en zona Bv. Oroño.', severity: 'CRITICAL', read: false, created_at: new Date().toISOString() },
          { id: '2', type: 'TAREA', title: 'Nueva Tarea Asignada', message: 'Revisión de cámaras Seguí y Avellaneda.', severity: 'INFO', read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
        ] as Notification[];
        set({ notifications: demo, unreadCount: 1 });
      }
    }
  },

  markAsRead: async (id) => {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (err) {
      set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    }
  },

  addNotification: (notif) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      read: false,
      ...notif
    } as Notification;
    set(state => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  subscribeToNotifications: () => {
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          get().addNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
