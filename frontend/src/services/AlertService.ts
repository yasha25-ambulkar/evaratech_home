import { Subject } from '../models/Observer';
import { AlertSeverity } from '../store/alertStore';

export interface AlertPayload {
    message: string;
    severity: AlertSeverity;
    source?: string;
}

class AlertService extends Subject<AlertPayload> {
    public sendAlert(message: string, severity: AlertSeverity, source?: string) {
        this.notify({ message, severity, source });
    }
}

export const alertService = new AlertService();
