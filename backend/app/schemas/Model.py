from pydantic import BaseModel
from datetime import date
from typing import Optional

class ModelBase(BaseModel):
    name: str
    version: str
    file_path: str
    note: Optional[str] = None

class ModelCreate(ModelBase):
    uploaded_by: int
    is_active: bool = True

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    version: Optional[str] = None
    file_path: Optional[str] = None
    is_active: Optional[bool] = None
    note: Optional[str] = None

class ModelResponse(ModelBase):
    model_id: int
    uploaded_by: int
    is_active: bool
    upload_time: date

    class Config:
        from_attributes = True