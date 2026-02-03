import httpx
from config import settings

class BlynkService:
    async def update(self, temp: float, level: float, motor_status: bool):
        motor_val = 1 if motor_status else 0
        url = (
            f"https://blynk.cloud/external/api/batch/update"
            f"?token={settings.BLYNK_AUTH_TOKEN}"
            f"&V1={temp}&V2={level}&V3={motor_val}"
        )
        
        try:
            async with httpx.AsyncClient() as client:
                await client.get(url)
        except Exception as e:
            print(f"⚠️ Blynk Update Failed: {e}")

blynk_service = BlynkService()
