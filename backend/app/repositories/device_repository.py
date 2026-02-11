from typing import Any, List, Optional
from app.core.base import BaseRepository

class DeviceRepository(BaseRepository):
    def __init__(self):
        super().__init__("devices")

    async def find_by_customer_id(self, customer_id: str) -> List[Any]:
        response = self.db.table(self.table).select("*").eq("customer_id", customer_id).execute()
        return response.data

    async def find_unassigned(self) -> List[Any]:
        response = self.db.table(self.table).select("*").is_("customer_id", "null").eq("is_active", True).execute()
        return response.data

    async def search_devices(self, search_term: str) -> List[Any]:
        response = self.db.table(self.table).select("*").or_(f"name.ilike.%{search_term}%,location_name.ilike.%{search_term}%").execute()
        return response.data

    async def get_stats(self) -> dict:
        # Simple stats implementation
        total = self.db.table(self.table).select("id", count="exact").execute().count
        active = self.db.table(self.table).select("id", count="exact").eq("is_active", True).execute().count
        return {
            "total": total,
            "active": active
        }
