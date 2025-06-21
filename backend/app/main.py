from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import users
from app.routes import Accounts
from app.routes import Profiles

app = FastAPI(title="My API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routes
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(Accounts.router, prefix="/api/Accounts", tags=["Accounts"])
app.include_router(Profiles.router, prefix="/api/Profiles", tags=["Profiles"])

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI with MongoDB!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}