from fastapi import FastAPI
from app.routes import form_routes, response_routes
from app.auth import routes as auth_routes
from app.websocket import routes as websocket_routes
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(form_routes.router, prefix="/forms", tags=["Forms"])
app.include_router(response_routes.router, tags=["responses"])
app.include_router(websocket_routes)

@app.on_event("startup")
async def startup_event():
    print("Backend is running...")

# Optional root route
@app.get("/")
def read_root():
    return {"message": "Collaborative Form Filling System is running."}