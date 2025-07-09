from pydantic import BaseModel
from datetime import date
from typing import Optional

class ImageBase(BaseModel):
    filename: str
    file_path: str
    format: str

class ImageCreate(ImageBase):
    user_id: int

class ImageUpdate(BaseModel):
    filename: Optional[str] = None
    file_path: Optional[str] = None
    format: Optional[str] = None

class ImageResponse(ImageBase):
    image_id: int
    user_id: int
    upload_time: date

    class Config:
        from_attributes = True