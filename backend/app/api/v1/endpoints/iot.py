from fastapi import APIRouter, Depends
from app.api import deps
from app.services.iot_service import iot_service
from typing import Any

router = APIRouter()

@router.get("/status")
async def get_iot_status(current_user: Any = Depends(deps.get_current_user)):
    return iot_service.get_state()

@router.post("/motor/toggle")
async def toggle_motor(current_user: Any = Depends(deps.get_current_user)):
    new_state = await iot_service.toggle_motor(user=current_user)
    return {"motor_on": new_state, "message": "Motor toggled successfully"}
