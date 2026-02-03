from pydantic import BaseModel

class Settings(BaseModel):
    # ThingSpeak Credentials
    TS_CHANNEL_ID: str = "3212670"
    TS_READ_API_KEY: str = "UXORK5OUGJ2VK5PX"

    # Blynk Credentials
    BLYNK_TEMPLATE_ID: str = "TMPL3cRHL4pDf"
    BLYNK_TEMPLATE_NAME: str = "WATER MONITOR"
    BLYNK_AUTH_TOKEN: str = "9w5Sp2t5WfVLl5rpCsSuO44E9AfWQJC8"

    # App Config
    POLLING_INTERVAL: int = 3  # seconds

settings = Settings()
