from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager

from config import settings
from services.state import state_manager
from services.thingspeak import thingspeak_service
from services.blynk import blynk_service
from models.schemas import SystemStatus, MotorToggleResponse, DrainageToggleResponse

# Lifecycle manager for background scheduler
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n✅ EVARA IOT SERVER ONLINE (Python/FastAPI)")
    print("📡 ThingSpeak Bridge: Active")
    print("📱 Blynk App Bridge: Active")
    
    scheduler = AsyncIOScheduler()
    scheduler.add_job(thingspeak_service.poll, 'interval', seconds=settings.POLLING_INTERVAL)
    scheduler.start()
    
    yield
    
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/status", response_model=SystemStatus)
async def get_status():
    return state_manager.get_state()

@app.post("/api/motor/toggle", response_model=MotorToggleResponse)
async def toggle_motor():
    new_state = state_manager.toggle_motor()
    
    # Sync with Blynk immediately
    current = state_manager.get_state()
    await blynk_service.update(current.temperature, current.tankLevel, current.motorOn)
    
    return {"success": True, "motorOn": new_state}

@app.post("/api/drainage/toggle", response_model=DrainageToggleResponse)
async def toggle_drainage():
    new_state = state_manager.toggle_drainage()
    return {"success": True, "drainageOn": new_state}
