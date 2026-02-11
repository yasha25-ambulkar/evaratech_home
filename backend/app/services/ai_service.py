from typing import Any, List, Dict, Optional
from app.core.base import BaseService
from app.core.decorators import performance_monitor
from app.services.events import event_bus
from loguru import logger

def levenshtein_distance(s1: str, s2: str) -> int:
    """Standard DSA implementation of Levenshtein Distance for fuzzy matching."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

class AICommand(BaseService):
    """Abstract Base for AI Commands"""
    async def execute(self, params: Dict[str, Any]) -> Any:
        raise NotImplementedError()

class AICommandRegistry:
    """Registry Pattern for dynamic command mapping."""
    def __init__(self):
        self.commands: Dict[str, AICommand] = {}
        self.keywords: Dict[str, str] = {} # keyword -> command_name

    def register(self, name: str, command: AICommand, keywords: List[str]):
        self.commands[name] = command
        for kw in keywords:
            self.keywords[kw] = name
        logger.debug(f"AI: Registered command '{name}' with keywords {keywords}")

    def find_best_match(self, text: str, threshold: int = 2) -> Optional[AICommand]:
        words = text.lower().split()
        
        # 1. Exact Match
        for word in words:
            if word in self.keywords:
                return self.commands[self.keywords[word]]
        
        # 2. Fuzzy Match (DSA)
        best_cmd = None
        min_dist = threshold + 1
        
        for kw, cmd_name in self.keywords.items():
            for word in words:
                dist = levenshtein_distance(kw, word)
                if dist < min_dist:
                    min_dist = dist
                    best_cmd = self.commands[cmd_name]
        
        if best_cmd:
            logger.info(f"AI: Fuzzy matched with distance {min_dist}")
        
        return best_cmd

class AIAssistantService(BaseService):
    def __init__(self):
        self.registry = AICommandRegistry()
        self._initialize_commands()

    def _initialize_commands(self):
        # We'll import these inside to avoid circular deps if needed
        from app.services.iot_service import iot_service
        
        class ToggleMotor(AICommand):
            async def execute(self, params):
                res = await iot_service.toggle_motor(params.get("user_email"))
                return {"action": "motor", "state": res}
        
        class GetStatus(AICommand):
            async def execute(self, params):
                return iot_service.get_state()

        self.registry.register("toggle_motor", ToggleMotor(), ["motor", "pump", "toggle", "switch", "start", "stop"])
        self.registry.register("get_status", GetStatus(), ["status", "reading", "level", "temperature", "how"])

    @performance_monitor
    async def process_text(self, text: str, user: Any) -> Dict[str, Any]:
        command = self.registry.find_best_match(text)
        
        if not command:
            return self.format_response(None, "I'm sorry, I couldn't understand that command. Did you mean 'status' or 'motor'?", success=False)

        user_email = user.get("email", "Unknown")
        result = await command.execute({"user_email": user_email})
        
        # Emit event for auditing
        await event_bus.emit("ai_command_executed", {"user": user_email, "text": text, "result": result})
        
        return self.format_response(result, "Intelligence processed successfully.")
