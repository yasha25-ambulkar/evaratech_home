from typing import Any, List, Optional, Protocol, TypeVar, runtime_checkable, Dict
from abc import ABC, abstractmethod
from app.db.supabase_client import supabase

T = TypeVar("T")

@runtime_checkable
class Repository(Protocol[T]):
    """Structural definition for any data repository."""
    async def get_all(self) -> List[Any]: ...
    async def get_by_id(self, id: str) -> Optional[Any]: ...

@runtime_checkable
class Service(Protocol):
    """Structural definition for any business service."""
    def format_response(self, data: Any, message: str = "Success", success: bool = True) -> Dict[str, Any]: ...

class BaseRepository(ABC):
    """Standard implementation of a repository."""
    def __init__(self, table_name: str):
        self.table = table_name
        self.db = supabase

    async def get_all(self) -> List[Any]:
        response = self.db.table(self.table).select("*").execute()
        return response.data

    async def get_by_id(self, id: str) -> Optional[Any]:
        response = self.db.table(self.table).select("*").eq("id", id).execute()
        return response.data[0] if response.data else None

class BaseService(ABC):
    """Standard implementation of a service with formatting utilities."""
    def format_response(self, data: Any, message: str = "Success", success: bool = True) -> Dict[str, Any]:
        return {
            "success": success,
            "message": message,
            "data": data
        }
