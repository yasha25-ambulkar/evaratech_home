from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from loguru import logger
import sys

# Configure Logger
logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs"
    )

    # Set all CORS enabled origins
    if settings.BACKEND_CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Include routers
    application.include_router(api_router, prefix=settings.API_V1_STR)

    @application.on_event("startup")
    async def startup_event():
        logger.info("Initializing EvaraTech Python Backend...")
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        from app.services.iot_service import iot_service
        
        scheduler = AsyncIOScheduler()
        scheduler.add_job(iot_service.poll_thingspeak, 'interval', seconds=15)
        scheduler.start()
        logger.info("Background Polling Started (15s interval)")
        
    @application.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "project": settings.PROJECT_NAME,
            "version": "1.0.0-py"
        }

    return application

app = create_application()
