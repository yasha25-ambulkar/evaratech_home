from typing import Any, Callable, Dict, List
import asyncio
from loguru import logger

class SimpleEventBus:
    """
    A lightweight Observer Pattern implementation.
    Allows decoupling of services via asynchronous events.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimpleEventBus, cls).__new__(cls)
            cls._instance.listeners = {}
        return cls._instance

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self.listeners:
            self.listeners[event_type] = []
        self.listeners[event_type].append(callback)
        logger.debug(f"EVENT: Subscribed to {event_type}")

    async def emit(self, event_type: str, data: Any):
        if event_type not in self.listeners:
            return

        logger.info(f"EVENT: Emitting {event_type}")
        tasks = []
        for callback in self.listeners[event_type]:
            if asyncio.iscoroutinefunction(callback):
                tasks.append(callback(data))
            else:
                callback(data)
        
        if tasks:
            await asyncio.gather(*tasks)

event_bus = SimpleEventBus()
