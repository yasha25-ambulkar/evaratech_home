from fastapi import APIRouter, Depends
from app.api import deps
from typing import Any

router = APIRouter()

@router.get("/")
async def get_users(current_user: Any = Depends(deps.check_role(3))):
    return {"message": "User list stub"}
