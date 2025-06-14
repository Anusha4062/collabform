from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, form_id: int, websocket: WebSocket):
        await websocket.accept()
        if form_id not in self.active_connections:
            self.active_connections[form_id] = []
        self.active_connections[form_id].append(websocket)

    def disconnect(self, form_id: int, websocket: WebSocket):
        self.active_connections[form_id].remove(websocket)
        if not self.active_connections[form_id]:
            del self.active_connections[form_id]

    async def broadcast(self, form_id: int, data: str):
        for connection in self.active_connections.get(form_id, []):
            await connection.send_text(data)

manager = ConnectionManager()
