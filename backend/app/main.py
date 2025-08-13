from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import accounts, profiles, roles, faqs, comments, bugreports, images, results, Models, suspendinfos, payments
from .database import engine
from contextlib import asynccontextmanager
from . import models
from .services.model_manager import model_manager

#DELETE　this　after
# Create tables
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await model_manager.init_async()
    yield


app = FastAPI(title="Your API", version="1.0.0", lifespan=lifespan)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://csci321.onrender.com"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(accounts.router, prefix="/api")
app.include_router(profiles.router, prefix="/api")
app.include_router(roles.router, prefix="/api")
app.include_router(faqs.router, prefix="/api")
app.include_router(comments.router, prefix="/api")
app.include_router(bugreports.router, prefix="/api")
app.include_router(images.router, prefix="/api")
app.include_router(results.router, prefix="/api")
app.include_router(Models.router, prefix="/api")
app.include_router(suspendinfos.router, prefix="/api")
app.include_router(payments.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to your FastAPI backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/ready")
def ready():
    return {"ready": model_manager.is_ready()}

