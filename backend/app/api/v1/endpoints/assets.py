from fastapi import APIRouter, Depends
from app.api import deps
from typing import Any

router = APIRouter()

@router.get("/")
async def get_assets(current_user: Any = Depends(deps.get_current_user)):
    return {"message": "Asset list stub"}
