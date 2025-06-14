from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()
active_connections: Dict[int, Dict[str, WebSocket]] = {}  # {form_id: {user_id: WebSocket}}

@router.websocket("/ws/forms/{form_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, form_id: int, user_id: str):
    await websocket.accept()
    if form_id not in active_connections:
        active_connections[form_id] = {}
    active_connections[form_id][user_id] = websocket

    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to all other users working on the same form
            for uid, connection in active_connections[form_id].items():
                if uid != user_id:
                    await connection.send_text(data)
    except WebSocketDisconnect:
        del active_connections[form_id][user_id]
        if not active_connections[form_id]:
            del active_connections[form_id]
