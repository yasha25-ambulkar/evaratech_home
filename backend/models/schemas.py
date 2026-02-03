from pydantic import BaseModel
from typing import Optional

class SystemStatus(BaseModel):
    tankLevel: float
    temperature: float
    motorOn: bool
    drainageOn: bool
    waterVolume: float | str
    lastUpdated: str

class MotorToggleResponse(BaseModel):
    success: bool
    motorOn: bool

class DrainageToggleResponse(BaseModel):
    success: bool
    drainageOn: bool
