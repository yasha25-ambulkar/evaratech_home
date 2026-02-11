from typing import Any, Optional, List
from app.core.base import BaseService
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.user import UserCreate, Token

class AuthService(BaseService):
    def __init__(self):
        self.user_repo = UserRepository()

    async def authenticate(self, email: str, password: str) -> Optional[Any]:
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user["password"]):
            return None
        return user

class UserService(BaseService):
    def __init__(self):
        self.user_repo = UserRepository()

    async def create_user(self, user_in: UserCreate, current_user_role: str) -> Any:
        # Permission check ported from backend Node.js
        if user_in.role != "CUSTOMER":
            self.check_permission(current_user_role, 4) # SUPER_ADMIN+
        
        hashed_password = get_password_hash(user_in.password)
        return await self.user_repo.create(user_in, hashed_password)

    async def get_admin_customers(self, admin_id: str, requesting_user: Any) -> List[Any]:
        # Merge logic check from backend2/src/app.js:117
        if admin_id != requesting_user["id"] and ROLE_HIERARCHY[requesting_user["role"]] < 4:
             raise Exception("Not authorized to view these customers")
        
        return await self.user_repo.get_customers_by_admin(admin_id)
