from typing import Any, List
from app.core.base import BaseRepository
from datetime import datetime

class TelemetryRepository(BaseRepository):
    def __init__(self):
        super().__init__("telemetry")

    async def log_reading(self, device_id: str, readings: dict) -> Any:
        data = {
            "device_id": device_id,
            "temperature": readings.get("temperature"),
            "tank_level": readings.get("tank_level"),
            "motor_on": readings.get("motor_on"),
            "drainage_on": readings.get("drainage_on"),
            "timestamp": datetime.utcnow().isoformat()
        }
        response = self.db.table(self.table).insert(data).execute()
        return response.data[0] if response.data else None
