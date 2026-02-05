import { create } from 'zustand';
import { notificationService } from '../services/notification.service';
import { alertService } from '../services/AlertService';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface Alert {
    id: string;
    message: string;
    severity: AlertSeverity;
    timestamp: Date;
    isRead: boolean;
    source?: string; // e.g., "Pump House 1", "System"
}

interface AlertStore {
    alerts: Alert[];
    unreadCount: number;
    addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: [],
    unreadCount: 0,

    addAlert: (alertData) => {
        const newAlert: Alert = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            isRead: false,
            ...alertData,
        };

        // Trigger browser notification
        notificationService.showNotification(newAlert.severity.toUpperCase() + ': ' + newAlert.source, {
            body: newAlert.message,
            tag: newAlert.id,
            data: { severity: newAlert.severity }
        });

        set((state) => {
            const updatedAlerts = [newAlert, ...state.alerts].slice(0, 100); // Keep last 100
            return {
                alerts: updatedAlerts,
                unreadCount: state.unreadCount + 1,
            };
        });
    },

    markAsRead: (id) => {
        set((state) => {
            const alert = state.alerts.find(a => a.id === id);
            if (!alert || alert.isRead) return state;

            return {
                alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        });
    },

    markAllAsRead: () => {
        set((state) => ({
            alerts: state.alerts.map(a => ({ ...a, isRead: true })),
            unreadCount: 0,
        }));
    },

    clearAlerts: () => {
        set({ alerts: [], unreadCount: 0 });
    },
}));

// Subscribe to AlertService

alertService.subscribe({
    update: (data) => {
        useAlertStore.getState().addAlert(data);
    }
});
