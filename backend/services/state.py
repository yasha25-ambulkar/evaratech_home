import threading
from datetime import datetime
from models.schemas import SystemStatus

class StateManager:
    def __init__(self):
        self._lock = threading.Lock()
        self._state = SystemStatus(
            tankLevel=0,
            temperature=0,
            motorOn=False,
            drainageOn=False,
            waterVolume=0,
            lastUpdated="Waiting..."
        )

    def get_state(self) -> SystemStatus:
        with self._lock:
            return self._state.model_copy()

    def update_sensors(self, temp: float, level: float):
        with self._lock:
            self._state.temperature = temp
            self._state.tankLevel = level
            # Calculate volume: (level * 0.18).toFixed(2)
            self._state.waterVolume = f"{(level * 0.18):.2f}"
            self._state.lastUpdated = datetime.now().strftime("%I:%M:%S %p")
            
            # Auto Motor Logic
            if level <= 20:
                self._state.motorOn = True
            if level >= 80:
                self._state.motorOn = False

    def toggle_motor(self) -> bool:
        with self._lock:
            self._state.motorOn = not self._state.motorOn
            return self._state.motorOn

    def toggle_drainage(self) -> bool:
        with self._lock:
            self._state.drainageOn = not self._state.drainageOn
            return self._state.drainageOn

state_manager = StateManager()
