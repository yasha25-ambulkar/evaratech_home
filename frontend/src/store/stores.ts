import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Settings Store
interface SettingsState {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    language: string;
    timezone: string;
    dataRetention: number;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    alertThreshold: number;
    updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
    resetSettings: () => void;
}

const defaultSettings = {
    theme: 'light' as const,
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
    dataRetention: 90,
    backupFrequency: 'daily' as const,
    alertThreshold: 80,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,
            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'evaratech-settings',
        }
    )
);

// Notification Store with Priority Queue
import { PriorityQueue } from '../utils/dataStructures';

export interface Notification {
    id: string;
    type: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    time: string;
    read: boolean;
    priority: number;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    queue: PriorityQueue<Notification>;
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read' | 'priority'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    queue: new PriorityQueue<Notification>(),

    addNotification: (notification) => {
        const priority = notification.type === 'critical' ? 1 :
            notification.type === 'warning' ? 2 : 3;

        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            time: new Date().toISOString(),
            read: false,
            priority,
        };

        set((state) => {
            state.queue.enqueue(newNotification, priority);
            return {
                notifications: [newNotification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };
        });

        // Play notification sound
        if (typeof Audio !== 'undefined') {
            new Audio('/notification.mp3').play().catch(() => { });
        }
    },

    markAsRead: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            return {
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        }
        return state;
    }),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
    })),

    deleteNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read ?
                Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
    }),

    clearAll: () => set({
        notifications: [],
        unreadCount: 0,
        queue: new PriorityQueue<Notification>(),
    }),
}));

// Device/Node Store with Caching
import { LRUCache } from '../utils/dataStructures';

export interface Device {
    id: string;
    name: string;
    type: 'pump' | 'sump' | 'tank' | 'bore' | 'govt';
    status: 'Normal' | 'Warning' | 'Critical';
    location: string;
    lastUpdate: string;
    position?: [number, number];
}

interface DeviceState {
    devices: Device[];
    cache: LRUCache<string, Device>;
    selectedDevice: Device | null;
    filters: {
        type: string;
        status: string;
        search: string;
    };
    setDevices: (devices: Device[]) => void;
    getDevice: (id: string) => Device | undefined;
    selectDevice: (device: Device | null) => void;
    updateFilters: (filters: Partial<DeviceState['filters']>) => void;
    getFilteredDevices: () => Device[];
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
    devices: [],
    cache: new LRUCache<string, Device>(100),
    selectedDevice: null,
    filters: {
        type: 'all',
        status: 'all',
        search: '',
    },

    setDevices: (devices) => {
        const cache = new LRUCache<string, Device>(100);
        devices.forEach(device => cache.set(device.id, device));
        set({ devices, cache });
    },

    getDevice: (id) => {
        const state = get();
        // Check cache first
        if (state.cache.has(id)) {
            return state.cache.get(id);
        }
        // Fallback to array search
        const device = state.devices.find(d => d.id === id);
        if (device) {
            state.cache.set(id, device);
        }
        return device;
    },

    selectDevice: (device) => set({ selectedDevice: device }),

    updateFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
    })),

    getFilteredDevices: () => {
        const { devices, filters } = get();
        return devices.filter(device => {
            const matchesType = filters.type === 'all' || device.type === filters.type;
            const matchesStatus = filters.status === 'all' || device.status === filters.status;
            const matchesSearch = device.name.toLowerCase().includes(filters.search.toLowerCase());
            return matchesType && matchesStatus && matchesSearch;
        });
    },
}));
