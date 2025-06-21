import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ATLAS_URI: str = os.getenv("ATLAS_URI", "mongodb+srv://kliu4894:jY072N71Zs9YPCJo@csci321.hvmysrv.mongodb.net/?retryWrites=true&w=majority&appName=CSCI321")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "Maize")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")

settings = Settings()