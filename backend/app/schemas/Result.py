from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class ResultTypeEnum(str, Enum):
    count = "count"
    disease = "disease"

class ResultBase(BaseModel):
    result_type: ResultTypeEnum
    result_data: str
    is_saved: bool = False
    note: Optional[str] = None

class ResultCreate(BaseModel):
    user_id: int
    image_id: int
    result_type: str  
    result_data: str  
    is_saved: Optional[bool] = True
    note: Optional[str] = None  

class ResultUpdate(BaseModel):
    result_type: Optional[ResultTypeEnum] = None
    result_data: Optional[str] = None
    is_saved: Optional[bool] = None
    note: Optional[str] = None

class ResultSaveToggle(BaseModel):
    is_saved: bool

class ResultResponse(ResultBase):
    result_id: int
    image_id: int
    user_id: int
    created_at: date

    class Config:
        from_attributes = True