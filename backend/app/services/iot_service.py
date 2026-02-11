import httpx
from typing import Any, Dict, List, Optional
from app.core.base import BaseService
from app.repositories.telemetry_repository import TelemetryRepository
from app.core.decorators import performance_monitor, validate_role
from app.services.events import event_bus
from loguru import logger
from datetime import datetime, timedelta
import os

class StatePredictor:
    """Predictive Layer: Basic linear regression for trend analysis."""
    @staticmethod
    def predict_empty_time(readings: List[Dict[str, Any]]) -> Optional[str]:
        if len(readings) < 5:
            return None
        
        # Sort by timestamp
        sorted_readings = sorted(readings, key=lambda x: x['timestamp'])
        
        # Calculate rates of change
        levels = [r['tank_level'] for r in sorted_readings]
        times = [(datetime.fromisoformat(r['timestamp'].replace('Z', '+00:00')) - 
                  datetime.fromisoformat(sorted_readings[0]['timestamp'].replace('Z', '+00:00'))).total_seconds() 
                 for r in sorted_readings]
        
        # Simple finite difference average
        deltas = []
        for i in range(1, len(levels)):
            time_diff = times[i] - times[i-1]
            level_diff = levels[i] - levels[i-1]
            if time_diff > 0:
                deltas.append(level_diff / time_diff)
        
        avg_rate = sum(deltas) / len(deltas) if deltas else 0
        
        if avg_rate >= 0: # Level is rising or stable
            return "Rising or Stable"
            
        # Time to zero = Current Level / |Rate|
        current_level = levels[-1]
        seconds_to_empty = current_level / abs(avg_rate)
        
        estimated_time = datetime.utcnow() + timedelta(seconds=seconds_to_empty)
        return estimated_time.isoformat()

class IotService(BaseService):
    def __init__(self):
        self.state = {
            "temperature": 0.0,
            "tank_level": 0.0,
            "motor_on": False,
            "drainage_on": False,
            "predictions": {},
            "last_update": None
        }
        self.telemetry_repo = TelemetryRepository()
        self.ts_channel_id = os.getenv("TS_CHANNEL_ID")
        self.ts_read_api_key = os.getenv("TS_READ_API_KEY")
        self.blynk_token = os.getenv("BLYNK_AUTH_TOKEN")

    @performance_monitor
    async def poll_thingspeak(self):
        if not self.ts_channel_id or not self.ts_read_api_key:
            return

        url = f"https://api.thingspeak.com/channels/{self.ts_channel_id}/feeds/last.json?api_key={self.ts_read_api_key}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    
                    new_temp = float(data.get("field1", 0)) if data.get("field1") else self.state["temperature"]
                    new_level = float(data.get("field2", 0)) if data.get("field2") else self.state["tank_level"]
                    
                    # Auto Motor Logic (Safety)
                    if new_level <= 20: self.state["motor_on"] = True
                    elif new_level >= 80: self.state["motor_on"] = False
                        
                    has_changed = (new_temp != self.state["temperature"] or 
                                  new_level != self.state["tank_level"])
                                  
                    self.state.update({
                        "temperature": new_temp,
                        "tank_level": new_level,
                        "last_update": datetime.utcnow().isoformat()
                    })
                    
                    if has_changed:
                        await self.telemetry_repo.log_reading("main_iot_unit", self.state)
                        await self._update_predictions()
                        await self.sync_with_blynk()
                        
                        # Emit event for other services
                        await event_bus.publish("iot_state_changed", self.state)
                        
            except Exception as e:
                logger.error(f"ThingSpeak Poll Failed: {e}")

    async def _update_predictions(self):
        """Intelligent Layer: Calculate trends periodically."""
        try:
            recent_readings = await self.telemetry_repo.get_all() # In production, limit to last 20
            # Just take last 10 for estimation
            subset = recent_readings[-10:] if len(recent_readings) > 10 else recent_readings
            
            prediction = StatePredictor.predict_empty_time(subset)
            self.state["predictions"]["estimated_empty_at"] = prediction
        except Exception as e:
            logger.warning(f"Prediction failed: {e}")

    @validate_role(3) # ADMIN+ only
    async def toggle_motor(self, user: Any) -> bool:
        self.state["motor_on"] = not self.state["motor_on"]
        logger.info(f"AUDIT: User {user.get('email')} toggled motor to {self.state['motor_on']}")
        await self.sync_with_blynk()
        await event_bus.emit("iot_motor_toggled", {"state": self.state["motor_on"], "user": user.get('email')})
        return self.state["motor_on"]

    async def sync_with_blynk(self):
        if not self.blynk_token: return
        motor_val = 1 if self.state["motor_on"] else 0
        url = (f"https://blynk.cloud/external/api/batch/update?token={self.blynk_token}"
               f"&V1={self.state['temperature']}&V2={self.state['tank_level']}&V3={motor_val}")
        async with httpx.AsyncClient() as client:
            try: await client.get(url)
            except Exception as e: logger.error(f"Blynk Sync Failed: {e}")

    def get_state(self) -> Dict[str, Any]:
        return self.state

iot_service = IotService()
