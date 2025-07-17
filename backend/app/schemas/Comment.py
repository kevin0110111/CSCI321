from pydantic import BaseModel
from datetime import date
from typing import Optional

class CommentBase(BaseModel):
    content: str
    rating: int
    is_anonymous: bool = False

class CommentCreate(CommentBase):
    user_id: int

class CommentUpdate(BaseModel):
    content: Optional[str] = None
    rating: Optional[int] = None
    is_anonymous: Optional[bool] = None

class CommentReply(BaseModel):
    reply_content: str
    replied_agent_id: int

class UserInfo(BaseModel):
    username: str

class CommentResponse(CommentBase):
    comment_id: int
    user_id: int
    created_at: date
    reply_content: Optional[str] = None
    replied_agent_id: Optional[int] = None
    replied_at: Optional[date] = None
    user: Optional[UserInfo] = None

    class Config:
        from_attributes = True