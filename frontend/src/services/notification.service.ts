type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

class NotificationService {
    // Audio context will be created on demand


    public async requestPermission(): Promise<NotificationPermissionStatus> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notification');
            return 'denied';
        }

        const permission = await Notification.requestPermission();
        return permission as NotificationPermissionStatus;
    }

    public showNotification(title: string, options?: NotificationOptions) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/evaratech-logo-new.png',
                badge: '/evaratech-logo-new.png',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Play sound for critical alerts
            if (options?.data?.severity === 'critical') {
                this.playAlertSound();
            }
        }
    }

    public playAlertSound() {
        // Create simple beep if file doesn't exist
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = 880; // A5
            gain.gain.value = 0.1;

            osc.start();
            setTimeout(() => {
                osc.stop();
                ctx.close();
            }, 300); // 300ms beep
        }
    }
}

export const notificationService = new NotificationService();
