import httpx
import json
from config import settings
from services.state import state_manager
from services.blynk import blynk_service

class ThingSpeakService:
    async def poll(self):
        url = (
            f"https://api.thingspeak.com/channels/{settings.TS_CHANNEL_ID}"
            f"/feeds/last.json?api_key={settings.TS_READ_API_KEY}"
        )
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                data = response.json()
                
                # Logic from server.js:
                # Field 1 -> Temperature
                # Field 2 -> Water Level
                
                # Get current state to fallback if fields are null
                current_state = state_manager.get_state()
                
                raw_temp = data.get('field1')
                raw_level = data.get('field2')
                
                real_temp = float(raw_temp) if raw_temp is not None else current_state.temperature
                real_level = float(raw_level) if raw_level is not None else current_state.tankLevel
                
                # Update local state (this also runs auto-motor logic)
                state_manager.update_sensors(real_temp, real_level)
                
                # Get updated state to sync with Blynk
                updated_state = state_manager.get_state()
                
                # Push to Blynk
                await blynk_service.update(
                    updated_state.temperature,
                    updated_state.tankLevel,
                    updated_state.motorOn
                )
                
        except Exception as e:
            print(f"Error parsing ThingSpeak data: {e}")

thingspeak_service = ThingSpeakService()
