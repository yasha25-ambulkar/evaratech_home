from fastapi import APIRouter, Depends
from app.api import deps
from app.services.ai_service import AIAssistantService
from typing import Any

router = APIRouter()

@router.post("/command")
async def ai_command(command: str, current_user: Any = Depends(deps.get_current_user)):
    ai_service = AIAssistantService()
    return await ai_service.process_text(command, current_user)
