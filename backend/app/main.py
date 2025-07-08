from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import accounts, profiles, roles, account_roles, faqs
from .database import engine
from . import models

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Your API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(accounts.router, prefix="/api")
app.include_router(profiles.router, prefix="/api")
app.include_router(roles.router, prefix="/api")
app.include_router(account_roles.router, prefix="/api")
app.include_router(faqs.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to your FastAPI backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}