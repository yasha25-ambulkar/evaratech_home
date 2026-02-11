import functools
import time
from loguru import logger
from fastapi import HTTPException, status
from typing import Any, Callable, TypeVar, cast
from app.core.config import ROLE_HIERARCHY

F = TypeVar("F", bound=Callable[..., Any])

def performance_monitor(func: F) -> F:
    """Decorator to log execution time of methods."""
    @functools.wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()
        result = await func(*args, **kwargs)
        end_time = time.perf_counter()
        duration = end_time - start_time
        logger.info(f"PERF: {func.__name__} executed in {duration:.4f}s")
        return result
    return cast(F, wrapper)

def validate_role(required_level: int) -> Callable[[F], F]:
    """Decorator for service-level role validation."""
    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Assuming 'user' is passed as a keyword argument or is first arg after 'self'
            user = kwargs.get("user") or (args[1] if len(args) > 1 else None)
            
            if not user or not isinstance(user, dict):
                 raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required for this action"
                )
            
            user_level = ROLE_HIERARCHY.get(user.get("role"), 0)
            if user_level < required_level:
                logger.warning(f"SECURITY: Unauthorized access attempt by {user.get('email')} to {func.__name__}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return cast(F, wrapper)
    return decorator
