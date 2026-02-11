from typing import Optional, List, Any
from app.core.base import BaseRepository
from app.schemas.user import UserCreate, UserUpdate

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("profiles")  # Profiles table in Supabase

    async def get_by_email(self, email: str) -> Optional[Any]:
        response = self.db.table(self.table).select("*").eq("email", email).execute()
        return response.data[0] if response.data else None

    async def create(self, user_in: UserCreate, hashed_password: str) -> Any:
        user_data = user_in.model_dump()
        user_data["password"] = hashed_password
        response = self.db.table(self.table).insert(user_data).execute()
        return response.data[0]

    async def get_customers_by_admin(self, admin_id: str) -> List[Any]:
        # Merge logic from backend2: filter by parent_id
        response = self.db.table(self.table).select("*").eq("parent_id", admin_id).execute()
        return response.data
