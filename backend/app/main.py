from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, todos
from .db.database import engine
from .models import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(todos.router, prefix="/api", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Todo API"} 