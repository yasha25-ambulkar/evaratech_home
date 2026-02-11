import os
from pydantic_settings import BaseSettings
from typing import List
from enum import Enum

class Role(str, Enum):
    COMMAND = "COMMAND"
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    DISTRIBUTOR = "DISTRIBUTOR"
    CUSTOMER = "CUSTOMER"

ROLE_HIERARCHY = {
    Role.COMMAND: 5,
    Role.SUPER_ADMIN: 4,
    Role.ADMIN: 3,
    Role.DISTRIBUTOR: 2,
    Role.CUSTOMER: 1
}

class Settings(BaseSettings):
    PROJECT_NAME: str = "EvaraTech API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-key-change-it")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:8080"]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
